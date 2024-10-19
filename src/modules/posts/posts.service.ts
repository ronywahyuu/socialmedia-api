import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { generateSlug } from 'src/utils/helpers';
import { createResponse } from 'src/utils/response.utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(page?: number, limit?: number, keyword?: string) {
    console.log('page', page);
    const where: Prisma.PostWhereInput = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};
    if (!page && !limit) {
      const posts = await this.prisma.post.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalPosts = await this.prisma.post.count({
        where,
      });

      return {
        posts,
        totalPosts,
      };
    }
    const skip = (page - 1) * limit;
    const posts = await this.prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPosts = await this.prisma.post.count({ where });

    return {
      totalData : totalPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    };

  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async createPost(payload: CreatePostDto) {
    const slug = generateSlug(payload.title);
    let uniqueSlug = slug;
    let counter = 1;

    while (await this.prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = generateSlug(payload.title, counter.toString());
      counter++;
    }

    const postPayload = {
      ...payload,
      slug: uniqueSlug,
    };
    return this.prisma.post.create({
      data: postPayload,
    });
  }

  async updatePost(id: number, payload: UpdatePostDto) {
    const isOwner = await this.prisma.post.findFirst({
      where: {
        id,
        authorId: payload.authorId,
      },
    });

    if (!isOwner) {
      throw new UnauthorizedException('You are not the owner of this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: payload,
    });
  }

  async deletePost(userId: number, id: number) {
    const isOwner = await this.prisma.post.findFirst({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!isOwner) {
      throw new UnauthorizedException('You are not the owner of this post');
    }
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async getCommentsByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
    });
  }
}
