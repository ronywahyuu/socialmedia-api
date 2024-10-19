import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createErrorResponse, createResponse } from 'src/utils/response.utils';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  getPosts(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.postsService.getPosts(Number(page  ), Number(limit), keyword);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    const postId = id;
    const post = await this.postsService.getPostById(postId);
    return createResponse({
      status: 'success',
      statusCode: HttpStatus.OK,
      message: 'Post retrieved successfully',
      data: post,
    });
    // try {
    // } catch (error) {
    //   throw new HttpException(
    //     createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error.message),
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createPost(@Request() req, @Body() payload: CreatePostDto) {
    const user = req.user;
    const ipAddress = req.ip;
    console.log('ipAddress', ipAddress);
    const PostPayload = {
      ...payload,
      authorId: user.userId as number,
    };

    const newPost = await this.postsService.createPost(PostPayload);
    return createResponse({
      status: 'success',
      statusCode: HttpStatus.CREATED,
      message: 'Post created successfully',
      data: newPost,
    });
    // try {
    // } catch (error) {
    //   throw new HttpException(
    //     createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error.message),
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async updatePost(@Request() req, @Body() payload: UpdatePostDto) {
    const user = req.user;
    const UpdatePayload = {
      ...payload,
      authorId: user.userId as number,
    };

    const updatedPost = await this.postsService.updatePost(
      payload.id,
      UpdatePayload,
    );
    return createResponse({
      status: 'success',
      statusCode: HttpStatus.OK,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async deletePost(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    const postId = id;
    await this.postsService.deletePost(userId, postId);
    return createResponse({
      status: 'success',
      statusCode: HttpStatus.OK,
      message: 'Post deleted successfully',
    });
  }
}
