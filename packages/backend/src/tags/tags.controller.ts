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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreatedTagDto, UpdatedTagDto } from '../models/tag';
import { ApiTags, ApiHeader } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll() {
    return this.tagsService.getAll();
  }

  @ApiHeader({ name: 'x-user-role', required: true })
  @Post()
  async createTag(
    @Body() tag: CreatedTagDto,
    @Headers('x-user-role') userRole: string,
  ) {
    return await this.tagsService.createTag(tag, userRole);
  }

  @ApiHeader({ name: 'x-user-role', required: true })
  @Patch(':id')
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() tag: UpdatedTagDto,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tagsService.updateTagById(id, tag, userRole);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag updated successfully',
      user: result,
    };
  }

  @ApiHeader({ name: 'x-user-role', required: true })
  @Delete(':id')
  async deleteTag(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tagsService.deleteTagById(id, userRole);
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
