import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { BlogInputType } from '../blog.entity';

@InputType()
export class ReadBlogInputDto extends PartialType(
  PickType(BlogInputType, ['id', 'ownerId']),
) {}
