import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createResponse } from 'src/utils/response.utils';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const {authorId, content, postId} = createCommentDto;

    const commentedPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!commentedPost) {
      throw new Error('Post not found');
    }
    console.log('authorId', authorId);

    const createdComment = await this.prisma.comment.create({
      data: {
        authorId,
        content,
        postId,
      }
    });

    return createResponse({
      statusCode: 201,
      status: 'success',
      message: 'Comment created successfully',
      data: createdComment,
    });

    // return 'This action adds a new comment';
  }

  findAll() {
    return this.prisma.comment.findMany();
    // return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
