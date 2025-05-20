import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { input } from 'src/common/consts';
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { CreateBlogInputDto } from './dtos/create-blog.dto';
import {
  AccessRole,
  AuthUser,
  RequiredRelationList,
} from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';
import { UpdateBlogInputDto } from './dtos/update-blog.dto';

@Resolver(() => Blog)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @AccessRole('USER')
  @Mutation(() => Blog, { description: '블로그 생성' })
  async createBlog(
    @Args(input) input: CreateBlogInputDto,
    @AuthUser() user: User,
  ): Promise<Blog> {
    return await this.blogService.createBlog(input, user);
  }

  @AccessRole('USER')
  @Mutation(() => Blog, { description: '블로그 수정' })
  @RequiredRelationList(['blog'])
  async updateBlog(
    @Args(input) input: UpdateBlogInputDto,
    @AuthUser() user: User,
  ): Promise<Blog> {
    return await this.blogService.updateBlog(input, user);
  }
}
