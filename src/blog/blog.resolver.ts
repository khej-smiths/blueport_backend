import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { ReadBlogInputDto } from './dtos/read-blog.dto';
import { ReadBlogListInputDto } from './dtos/read-blog-list.dto';

@Resolver(() => Blog)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @AccessRole('USER')
  @Mutation(() => Blog, { description: '블로그 생성' })
  @RequiredRelationList(['blog'])
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

  // TODO 도메인으로도 조회할 수 있도록 옵션 추가 필요(디스코드)
  @Query(() => Blog, { description: '블로그 조회' })
  async readBlog(@Args(input) input: ReadBlogInputDto): Promise<Blog> {
    return await this.blogService.readBlog(input);
  }

  @Query(() => [Blog], { description: '블로그 목록 조회' })
  async readBlogList(
    @Args(input) input: ReadBlogListInputDto,
  ): Promise<Array<Blog>> {
    return await this.blogService.readBlogList(input);
  }

  // TODO 블로그 삭제
}
