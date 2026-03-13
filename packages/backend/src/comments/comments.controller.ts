import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from "./comments.service";
import { CommentType, CreatedCommentType } from "../models/comment";

@Controller('comments')
export class CommentsController {

  constructor(private readonly commentService: CommentsService) {
  }

  @Get()
  getAll() {
    return this.commentService.getAll()
  }

  @Post()
  createComment(@Body() comment: CreatedCommentType) {
    return this.commentService.createComment(comment)
  }

  @Patch(':id')
  updateComment(@Param() id: string, @Body() comment: CommentType){
    return this.commentService.updateCommentById(id, comment)
  }

  @Delete()
  deleteComment(@Param() id: string){
    return this.commentService.deleteCommentById(id)
  }

  @Get(':id')
  getComment(@Param() id: string){
    return this.commentService.getCommentById(id)
  }

}
