import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from "./comments.service";
import {
  CommentType,
  CreatedCommentType,
  UpdatedCommentType,
} from '../models/comment';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getAll() {
    return this.commentService.getAll();
  }

  @Post()
  createComment(@Body() comment: CreatedCommentType) {
    return this.commentService.createComment(comment);
  }

  @Patch(':id')
  updateComment(@Param('id') id: string, @Body() comment: UpdatedCommentType) {
    const result = this.commentService.updateCommentById(+id, comment);
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment updated successfully',
      id: result,
    };
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string) {
    const result = this.commentService.deleteCommentById(+id);
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment deleted successfully',
      id: result,
    };
  }

  @Get(':id')
  getComment(@Param('id') id: string) {
    const result = this.commentService.getCommentById(+id);
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return result;
  }
}
