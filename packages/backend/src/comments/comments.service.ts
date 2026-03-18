import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import {
  CommentType,
  CreatedCommentType,
  UpdatedCommentType,
} from '../models/comment';
import { DBService } from '../db/db.service';

@Injectable()
export class CommentsService {
  private logger = new Logger(CommentsService.name);

  constructor(private prisma: DBService) {}

  async getAll(showAll: boolean = false) {
    const comments = await this.prisma.comment.findMany({
      where: {
        deletedAt: null,
        status: showAll ? undefined : 'visible',
      },
    });
    this.logger.debug('get all comments');
    return comments;
  }

  async createComment(
    data: CreatedCommentType,
    currentUser: { id: number; role: string },
  ) {
    const createdComment = await this.prisma.comment.create({
      data: {
        ...data,
        authorId: currentUser.id,
        taskId: +data.taskId,
        status: 'visible',
        deletedAt: null,
      },
    });
    this.logger.debug('add comment', createdComment);

    return createdComment;
  }

  async getCommentById(id: number) {
    const commentExists = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: true, task: true },
    });
    if (!commentExists) return null;

    this.logger.debug(`get comment ${id}`);
    return commentExists;
  }

  async deleteCommentById(id: number, currentUser: { id: number; role: string }) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) return null;

    if (currentUser.role !== 'admin' && comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.debug(`delete comment ${id}`);
    return id;
  }

  async updateCommentById(
    id: number,
    updatedComment: UpdatedCommentType,
    currentUser: { id: number; role: string },
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { task: true },
    });
    if (!comment) return null;

    const { authorId, taskId, status, content, ...dataToUpdate } =
      updatedComment;

   if (content && comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    if (status && currentUser.role !== 'admin' && comment.task.authorId !== currentUser.id) {
        throw new ForbiddenException('Only admin or task author can change comment status');
    }

    await this.prisma.comment.update({
      where: { id },
      data: {
        ...dataToUpdate,
        content: content,
        status: status,
        updatedAt: new Date(),
      },
    });
    this.logger.debug(`update comment ${id}`);
    return id;
  }
}
