import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Headers,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CreatedCommentDto,
  UpdatedCommentDto,
  GetCommentsDto,
} from '../models/comment';
import { ApiTags, ApiHeader, ApiOperation } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getAll(@Query() query: GetCommentsDto) {
    return this.commentService.getAll(query.all === true);
  }

  @ApiHeader({ name: 'x-user-id', required: true })
  @ApiHeader({ name: 'x-user-role', required: true })
  @Post()
  async createComment(
    @Body() comment: CreatedCommentDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    return await this.commentService.createComment(comment, {
      id: +userId,
      role: userRole,
    });
  }

  @ApiHeader({ name: 'x-user-id', required: true })
  @ApiHeader({ name: 'x-user-role', required: true })
  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() comment: UpdatedCommentDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.commentService.updateCommentById(id, comment, {
      id: +userId,
      role: userRole,
    });
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment updated successfully',
      id: result,
    };
  }

  @ApiHeader({ name: 'x-user-id', required: true })
  @ApiHeader({ name: 'x-user-role', required: true })
  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.commentService.deleteCommentById(id, {
      id: +userId,
      role: userRole,
    });
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment deleted successfully',
      id: result,
    };
  }

  @Get(':id')
  async getComment(@Param('id', ParseIntPipe) id: number) {
    const result = await this.commentService.getCommentById(id);
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return result;
  }
}
