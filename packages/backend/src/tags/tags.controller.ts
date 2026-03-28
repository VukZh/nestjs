import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Headers,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreatedTagDto, UpdatedTagDto } from '../models/tag';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import type { Request } from 'express';

@SkipThrottle()
@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll() {
    return this.tagsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTag(
    @Body() tag: CreatedTagDto,
    @Req() req: Request & { user: { role: string } },
  ) {
    return await this.tagsService.createTag(tag, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() tag: UpdatedTagDto,
    @Req() req: Request & { user: { role: string } },
  ) {
    const result = await this.tagsService.updateTagById(id, tag, req.user.role);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag updated successfully',
      user: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTag(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { role: string } },
  ) {
    const result = await this.tagsService.deleteTagById(id, req.user.role);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag deleted successfully',
      id: result,
    };
  }

  @Get(':id')
  async getTag(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tagsService.getTagById(id);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return result;
  }
}
