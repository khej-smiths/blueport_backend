import { InputType, PickType } from '@nestjs/graphql';
import { BlogInputType } from '../blog.entity';

@InputType()
export class CreateBlogInputDto extends PickType(BlogInputType, [
  'name',
  'domain',
  'profilePhoto',
  'introduction',
  'skills',
]) {}
