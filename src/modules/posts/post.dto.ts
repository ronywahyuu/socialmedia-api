import { ApiProperty, PartialType } from '@nestjs/swagger';
import { isEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  status: PostStatus.DRAFT;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class GetPostDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

// export class 