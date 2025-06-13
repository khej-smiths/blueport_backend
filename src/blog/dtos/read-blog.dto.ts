import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { BlogInputType } from '../blog.entity';

@InputType()
export class ReadBlogInputDto extends PartialType(
  // TODO ownerId 제거
  PickType(BlogInputType, ['id', 'ownerId', 'domain']),
) {}
