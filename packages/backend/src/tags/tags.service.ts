import { Injectable, Logger } from '@nestjs/common';
import { CreatedTagType, TagType, UpdatedTagType } from '../models/tag';
import { DBService } from '../db/db.service';

@Injectable()
export class TagsService {
  private logger = new Logger(TagsService.name);

  constructor(private prisma: DBService) {}

  async getAll() {
    const tags = await this.prisma.tag.findMany();
    this.logger.debug('get all tags', tags);
    return tags;
  }

  async createTag(tag: CreatedTagType) {
    const createdTag = await this.prisma.tag.create({
      data: {
        ...tag,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    });
    this.logger.debug('add tag', createdTag);
    return createdTag;
  }

  async getTagById(id: number) {
    const tagExists = await this.prisma.tag.findUnique({ where: { id } });
    if (!tagExists) return null;

    this.logger.debug(`get tag ${id}`);
    return tagExists;
  }

  async deleteTagById(id: number) {
    const tagExists = await this.prisma.tag.findUnique({ where: { id } });
    if (!tagExists) return null;

    await this.prisma.tag.update({
      where: { id },
      data: { deletedAt: new Date().toISOString() },
    });
    this.logger.debug(`delete tag ${id}`);
    return id;
  }

  async updateTagById(id: number, tagUpdated: UpdatedTagType) {
    const tagExists = await this.prisma.tag.findUnique({ where: { id } });
    if (!tagExists) return null;

    await this.prisma.tag.update({
      where: { id },
      data: {
        ...tagUpdated,
        updatedAt: new Date().toISOString(),
      },
    });
    this.logger.debug(`update tag ${id}`);
    return id;
  }
}
