import { Injectable } from '@nestjs/common';
import { CommentType, CreatedCommentType } from "../models/comment";

@Injectable()
export class CommentsService {
  private comments: CommentType[] = [];

  getAll(){
    return this.comments;
  }

  createComment(comment: CreatedCommentType){
    this.comments.push({...comment,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    });
  }

  getCommentById(id: string){
    return this.comments.find(comment => comment.id === id);
  }

  deleteCommentById(id: string){
    return this.comments = this.comments.filter(comment => comment.id !== id);
  }

  updateCommentById(id: string, updatedComment: CommentType) {
    this.comments = this.comments.map(comment => comment.id === id ? updatedComment : comment);
    return updatedComment;
  }


}
