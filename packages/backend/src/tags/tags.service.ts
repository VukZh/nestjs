import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreatedTagType, TagType, UpdatedTagType } from '../models/tag';
import { DBService } from '../db/db.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: DBService) {}

  private readonly logger = new Logger(TagsService.name);

  async getAll() {
    const tags = await this.prisma.tag.findMany({
      where: { deletedAt: null },
    });
    this.logger.debug('get all tags');
    return tags;
  }
  async createTag(tag: CreatedTagType, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can create tags');
    }
    const createdTag = await this.prisma.tag.create({
      data: { ...tag, deletedAt: null },
    });
    this.logger.debug('add tag', tag);

    return createdTag;
  }
  async getTagById(id: number) {
    const tagExists = await this.prisma.tag.findUnique({ where: { id } });
    if (!tagExists) return null;

    this.logger.debug(`get tag ${id}`);
    return tagExists;
  }
  async deleteTagById(id: number, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can delete tags');
    }
    const tagExists = await this.prisma.tag.findUnique({ where: { id } });
    if (!tagExists) return null;

    await this.prisma.tag.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.debug(`delete tag ${id}`);
    return id;
  }
  async updateTagById(id: number, tagUpdated: UpdatedTagType, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can update tags');
    }
    const tagExists = await this.prisma.tag.findUnique({ where: { id } });
    if (!tagExists) return null;

    const { ...dataToUpdated } = tagUpdated;

    await this.prisma.tag.update({
      where: { id },
      data: {
        ...dataToUpdated,
        updatedAt: new Date(),
      },
    });
    this.logger.debug(`update tag ${id}`);
    return id;
  }
}
