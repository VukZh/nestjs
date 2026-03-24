import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CreatedCommentDto,
  UpdatedCommentDto,
  GetCommentsDto,
} from '../models/comment';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { Request } from 'express';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getAll(@Query() query: GetCommentsDto) {
    return this.commentService.getAll(query.all === true);
  }

  @Post()
  async createComment(
    @Body() comment: CreatedCommentDto,
    @Req() req: Request & {
      user: { id: number; role: string };
    }
  ) {
    return await this.commentService.createComment(comment, req.user);
  }

  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() comment: UpdatedCommentDto,
    @Req() req: Request & {
      user: { id: number; role: string };
    }
  ) {
    const result = await this.commentService.updateCommentById(id, comment, req.user);
    if (!result) throw new NotFoundException(`Comment ${id} not found`);
    return {
      message: 'Comment updated successfully',
      id: result,
    };
  }

  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & {
      user: { id: number; role: string };
    }
  ) {
    const result = await this.commentService.deleteCommentById(id, req.user);
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
