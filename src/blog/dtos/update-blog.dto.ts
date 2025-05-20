import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { BlogInputType } from '../blog.entity';

@InputType()
export class UpdateBlogInputDto extends PartialType(
  PickType(BlogInputType, [
    'name',
    'domain',
    'greeting',
    'photo',
    'introduction',
    'skills',
    'email',
    'github',
  ]),
) {}
