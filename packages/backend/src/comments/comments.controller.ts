import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Headers, Query } from '@nestjs/common';
import { CommentsService } from "./comments.service";
import { CreatedCommentDto, UpdatedCommentDto } from '../models/comment';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getAll(@Query('all') all?: string) {
    return this.commentService.getAll(all === 'true');
  }

  @Post()
  async createComment(
    @Body() comment: CreatedCommentDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    return await this.commentService.createComment(comment, { id: +userId, role: userRole });
  }

  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() comment: UpdatedCommentDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.commentService.updateCommentById(+id, comment, { id: +userId, role: userRole });
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment updated successfully',
      id: result,
    };
  }

  @Delete(':id')
  async deleteComment(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.commentService.deleteCommentById(+id, { id: +userId, role: userRole });
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment deleted successfully',
      id: result,
    };
  }

  @Get(':id')
  async getComment(@Param('id') id: string) {
    const result = await this.commentService.getCommentById(+id);
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return result;
  }
}
