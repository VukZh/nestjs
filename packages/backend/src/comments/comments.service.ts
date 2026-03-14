import { Injectable, Logger } from '@nestjs/common';
import { CommentType, CreatedCommentType } from '../models/comment';

@Injectable()
export class CommentsService {
  private comments: CommentType[] = [];
  private logger = new Logger(CommentsService.name);

  getAll() {
    this.logger.debug('get all comments');
    return this.comments;
  }

  createComment(comment: CreatedCommentType) {
    this.comments.push({
      ...comment,
      id: (Math.floor(Math.random() * (1000000 - 1 + 1)) + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });
    this.logger.debug('add comment', comment);

    return comment;
  }

  getCommentById(id: string) {
    this.logger.debug(`get comment ${JSON.stringify(id)}`);
    const commentExists = this.comments.some((comment) => comment?.id === id);
    if (!commentExists) return null;

    this.logger.debug(`get comment ${id}`);
    return this.comments.find((comment) => comment?.id === id);
  }

  deleteCommentById(id: string) {
    const commentExists = this.comments.some((comment) => comment?.id === id);
    if (!commentExists) return null;

    this.comments = this.comments.map((comment) =>
      comment.id === id
        ? { ...comment, deletedAt: new Date().toISOString() }
        : comment,
    );
    this.logger.debug(`delete comment ${id}`);
    return id;
  }

  updateCommentById(id: string, updatedComment: CommentType) {
    const commentExists = this.comments.some((comment) => comment?.id === id);
    if (!commentExists) return null;

    this.comments = this.comments.map((comment) =>
      comment.id === id
        ? { ...updatedComment, updatedAt: new Date().toISOString() }
        : comment,
    );
    this.logger.debug(`update comment ${id}`);
    return id;
  }
}
