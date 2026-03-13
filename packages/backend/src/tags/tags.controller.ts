import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TagsService } from "./tags.service";
import { CreatedTagType, TagType } from "../models/tag";

@Controller('tags')
export class TagsController {

  constructor(private readonly tagsService: TagsService) {

  }

  @Get()
  getAll() {
    return this.tagsService.getAll()
  }

  @Post()
  createTag(@Body() tag: CreatedTagType){
    return this.tagsService.createTag(tag)
  }

  @Patch(':id')
  updateTag(@Param('') id: string, @Body() tag: TagType){
    return this.tagsService.updateTagById(id, tag)
  }

  @Delete(':id')
  deleteTag(@Param('') id: string){
    return this.tagsService.deleteTagById(id)
  }

  @Get(':id')
  getTag(@Param('') id: string){
    return this.tagsService.getTagById(id)
  }


}
