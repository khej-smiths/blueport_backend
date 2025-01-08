import { InputType, PickType } from '@nestjs/graphql';
import { PostInputType } from '../post.model';

@InputType()
export class CreatePostInputDto extends PickType(PostInputType, [
  'title',
  'content',
]) {}
