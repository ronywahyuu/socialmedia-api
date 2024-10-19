import { ApiProperty } from "@nestjs/swagger";

export class CreateLikeDto {
  @ApiProperty()
  postId: number;
  
  userId: number;
}
