import { IsNumber } from "class-validator";

export class CommentHeartDto {
  @IsNumber()
  comment_id: number;
}