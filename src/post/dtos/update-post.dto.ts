import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { PostInputType } from '../post.entity';

@InputType()
export class UpdatePostInputDto extends IntersectionType(
  PickType(PostInputType, ['id']),
  PartialType(PickType(PostInputType, ['title', 'content'])),
) {}
