import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreatedTagDto, UpdatedTagDto } from '../models/tag';
import { DBService } from '../db/db.service';
import { isLoggingEnabled } from '../config';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: DBService) {}

  private readonly logger = new Logger(TagsService.name);

  async getAll() {
    const tags = await this.prisma.tag.findMany({
      where: { deletedAt: null },
    });
    isLoggingEnabled && this.logger.debug('get all tags');
    return tags;
  }
  async createTag(tag: CreatedTagDto, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can create tags');
    }
    const createdTag = await this.prisma.tag.create({
      data: { ...tag, deletedAt: null },
    });
    isLoggingEnabled && this.logger.debug('add tag', tag);

    return createdTag;
  }
  async getTagById(id: number) {
    const tagExists = await this.prisma.tag.findUnique({
      where: { id, deletedAt: null },
    });
    if (!tagExists) return null;

    isLoggingEnabled && this.logger.debug(`get tag ${id}`);
    return tagExists;
  }
  async deleteTagById(id: number, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can delete tags');
    }
    const tagExists = await this.prisma.tag.findUnique({
      where: { id, deletedAt: null },
    });
    if (!tagExists) return null;

    await this.prisma.tag.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    isLoggingEnabled && this.logger.debug(`delete tag ${id}`);
    return id;
  }
  async updateTagById(id: number, tagUpdated: UpdatedTagDto, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can update tags');
    }
    const tagExists = await this.prisma.tag.findUnique({
      where: { id, deletedAt: null },
    });
    if (!tagExists) return null;

    const { ...dataToUpdated } = tagUpdated;

    await this.prisma.tag.update({
      where: { id, deletedAt: null },
      data: {
        ...dataToUpdated,
        updatedAt: new Date(),
      },
    });
    isLoggingEnabled && this.logger.debug(`update tag ${id}`);
    return id;
  }
}
