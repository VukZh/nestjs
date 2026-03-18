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
} from '@nestjs/common';
import { TagsService } from "./tags.service";
import { CreatedTagType, TagType, UpdatedTagType } from '../models/tag';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll() {
    return this.tagsService.getAll();
  }

  @Post()
  async createTag(
    @Body() tag: CreatedTagType,
    @Headers('x-user-role') userRole: string,
  ) {
    return await this.tagsService.createTag(tag, userRole);
  }

  @Patch(':id')
  async updateTag(
    @Param('id') id: string,
    @Body() tag: UpdatedTagType,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tagsService.updateTagById(+id, tag, userRole);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  async deleteTag(
    @Param('id') id: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tagsService.deleteTagById(+id, userRole);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag deleted successfully',
      id: result,
    };
  }

  @Get(':id')
  async getTag(@Param('id') id: string) {
    const result = await this.tagsService.getTagById(+id);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return result;
  }
}
