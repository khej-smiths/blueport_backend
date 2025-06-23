import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import { ResumeDataLoaderService } from '../resume/resume.data-loader';

@Resolver(() => Blog)
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,
    private readonly resumeDataLoaderService: ResumeDataLoaderService,
  ) {}

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

  @ResolveField('resumeId', () => String, {
    description: '블로그 주인의 이력서 Id',
    nullable: true,
  })
  async readUser(@Parent() blog: Blog): Promise<string | null> {
    return this.resumeDataLoaderService.getResumeIdsByOwnerIds.load(
      blog.ownerId,
    );
  }
}
