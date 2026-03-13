import { Injectable } from '@nestjs/common';
import { CreatedTagType, TagType } from "../models/tag";

@Injectable()
export class TagsService {

  private tags: TagType[] = [];

  getAll() {
    return this.tags;
  }

  createTag(tag: CreatedTagType) {
    return this.tags.push({
      ...tag,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    });
  }

  getTagById(id: string) {
    return this.tags.find((tag) => tag.id === id);
  }

  deleteTagById(id: string) {
    return this.tags = this.tags.filter(tag => tag.id !== id)
  }

  updateTagById(id: string, tagUpdated: TagType) {
    this.tags = this.tags.map(tag => tag.id === id ? tagUpdated : tag);
    return tagUpdated;
  }


}
