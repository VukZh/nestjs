import { Injectable, Logger } from '@nestjs/common';
import { CreatedTagType, TagType } from "../models/tag";

@Injectable()
export class TagsService {
  private tags: TagType[] = [];
  private logger = new Logger(TagsService.name);

  getAll() {
    this.logger.debug('get all tags');
    return this.tags;
  }

  createTag(tag: CreatedTagType) {
    this.tags.push({
      ...tag,
      id: (Math.floor(Math.random() * (1000000 - 1 + 1)) + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });
    this.logger.debug('add tag', tag);

    return tag;
  }

  getTagById(id: string) {
    const tagExists = this.tags.some((tag) => tag?.id === id);
    if (!tagExists) return null;

    this.logger.debug(`get tag ${id}`);
    return this.tags.find((tag) => tag?.id === id);
  }

  deleteTagById(id: string) {
    const tagExists = this.tags.some((tag) => tag?.id === id);
    if (!tagExists) return null;

    this.tags = this.tags.map((tag) =>
      tag.id === id ? { ...tag, deletedAt: new Date().toISOString() } : tag,
    );
    this.logger.debug(`delete tag ${id}`);
    return id;
  }

  updateTagById(id: string, tagUpdated: TagType) {
    const tagExists = this.tags.some((tag) => tag?.id === id);
    if (!tagExists) return null;

    this.tags = this.tags.map((tag) =>
      tag.id === id
        ? { ...tagUpdated, updatedAt: new Date().toISOString() }
        : tag,
    );
    this.logger.debug(`update tag ${id}`);
    return id;
  }
}
