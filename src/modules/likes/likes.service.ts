import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createResponse } from 'src/utils/response.utils';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto) {
    // return 'This action adds a new like';

    const { postId, userId } = createLikeDto;

    const likedPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    const likedByUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!likedPost || !likedByUser) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }


    // toggle like if already liked
    const existingLike = await this.prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // await this.prisma.like.delete({
      //   where: {
      //     id: existingLike.id,
      //   },
      // });

      await this.prisma.like.update({
        where: {
          id: existingLike.id,
        },
        data:{
          updatedAt: new Date(),
        }
      });

      return createResponse({
        statusCode: 200,
        status: 'success',
        message: 'Post unliked',
        data: existingLike,
      });
    }
    
    const like = await this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    return createResponse({
      statusCode: 201,
      status: 'success',
      message: 'Post liked',
      data: like,
    });
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    // return `This action updates a #${id} like`;
    const { postId, userId } = updateLikeDto;

    const like = await this.prisma.like.update({
      where: { id },
      data: {
        postId,
        userId,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
