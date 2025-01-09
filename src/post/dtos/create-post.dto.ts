import { InputType, PickType } from '@nestjs/graphql';
import { PostInputType } from '../post.entity';

@InputType()
export class CreatePostInputDto extends PickType(PostInputType, [
  'title',
  'content',
]) {}
