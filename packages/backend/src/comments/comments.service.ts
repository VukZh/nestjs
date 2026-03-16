import { Injectable, Logger } from '@nestjs/common';
import { CommentType, CreatedCommentType } from '../models/comment';
import { DBService } from '../db/db.service';

@Injectable()
export class CommentsService {
  private logger = new Logger(CommentsService.name);

  constructor(private prisma: DBService) {}

  async getAll() {
    const comments = await this.prisma.comment.findMany();
    this.logger.debug('get all comments');
    return comments;
  }

  async createComment(comment: CreatedCommentType) {
    const createdComment = await this.prisma.comment.create({
      data: {
        ...comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    });
    this.logger.debug('add comment', createdComment);

    return createdComment;
  }

  async getCommentById(id: number) {
    const commentExists = await this.prisma.comment.findUnique({ where: { id } });
    if (!commentExists) return null;

    this.logger.debug(`get comment ${id}`);
    return commentExists;
  }

  async deleteCommentById(id: number) {
    const commentExists = await this.prisma.comment.findUnique({ where: { id } });
    if (!commentExists) return null;

    await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date().toISOString() },
    });

    this.logger.debug(`delete comment ${id}`);
    return id;
  }

  async updateCommentById(id: number, updatedComment: CommentType) {
    const commentExists = await this.prisma.comment.findUnique({ where: { id } });
    if (!commentExists) return null;

    await this.prisma.comment.update({
      where: { id },
      data: {
        ...updatedComment,
        id: +updatedComment.id!,
        updatedAt: new Date().toISOString(),
      },
    });
    this.logger.debug(`update comment ${id}`);
    return id;
  }
}
