import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TagsService } from "./tags.service";
import { CreatedTagType, TagType } from "../models/tag";

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll() {
    return this.tagsService.getAll();
  }

  @Post()
  createTag(@Body() tag: CreatedTagType) {
    return this.tagsService.createTag(tag);
  }

  @Patch(':id')
  updateTag(@Param('id') id: string, @Body() tag: TagType) {
    const result = this.tagsService.updateTagById(id, tag);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string) {
    const result = this.tagsService.deleteTagById(id);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return {
      message: 'Tag deleted successfully',
      user: result,
    };
  }

  @Get(':id')
  getTag(@Param('id') id: string) {
    const result = this.tagsService.getTagById(id);
    if (!result) throw new NotFoundException(`Tag ${id} not found`);
    return result;
  }
}
