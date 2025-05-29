import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Post } from './post.entity';
import { input } from 'src/common/consts';
import { PostService } from './post.service';
import { ReadPostInputDto } from './dtos/read-post.dto';
import { User } from 'src/user/user.entity';
import { ReadPostListInputDto } from './dtos/read-post-list.dto';
import { CreatePostInputDto } from './dtos/create-post.dto';
import {
  AccessRole,
  AuthUser,
  RequiredRelationList,
} from 'src/auth/auth.decorator';
import { UpdatePostInputDto } from './dtos/update-post.dto';
import { DeletePostInputDto } from './dtos/delete-post.dto';
import { UserDataLoaderService } from 'src/user/user.data-loader';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userDataLoaderService: UserDataLoaderService,
  ) {}

  @AccessRole('USER')
  @Mutation(() => Post, {
    description: '게시글 작성하기, 로그인 유저만 게시글 작성 가능',
  })
  @RequiredRelationList(['blog'])
  async createPost(
    @Args(input) input: CreatePostInputDto,
    @AuthUser() user: User,
  ): Promise<Post> {
    return await this.postService.createPost(user, input);
  }

  @Query(() => [Post], { description: '게시글 목록 조회하기' })
  async readPostList(
    @Args(input) input: ReadPostListInputDto,
  ): Promise<Array<Post>> {
    return await this.postService.readPostList(input);
  }

  @Query(() => Post, { description: '게시글 조회하기' })
  async readPost(@Args(input) input: ReadPostInputDto): Promise<Post> {
    return await this.postService.readPost(input);
  }

  @AccessRole('USER')
  @Mutation(() => Post, { description: '게시글 수정하기' })
  async updatePost(
    @Args('input') input: UpdatePostInputDto,
    @AuthUser() writer: User,
  ) {
    return await this.postService.updatePost(input, writer);
  }

  @AccessRole('USER')
  @Mutation(() => Boolean, { description: '게시글 삭제하기' })
  async deletePost(
    @Args('input') input: DeletePostInputDto,
    @AuthUser() writer: User,
  ) {
    return await this.postService.deletePost(input, writer);
  }

  @ResolveField('writer', () => User, {
    description: '게시글 작성자',
  })
  async readUser(@Parent() post: Post): Promise<User> {
    return this.userDataLoaderService.getUsersByIds.load(post.writerId);
  }
}
