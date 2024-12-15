import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Post, PostInputType } from './post.model';
import { input } from 'src/common/consts';
import { PostService } from './post.service';
import { ReadPostInputDto } from './dtos/read-post.dto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { ReadPostListInputDto } from './dtos/read-post-list.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [Post])
  async readPostList(
    @Args(input) input: ReadPostListInputDto,
  ): Promise<Array<Post>> {
    return [];
  }

  @Query(() => Post)
  async readPost(@Args(input) input: ReadPostInputDto): Promise<Post> {
    return await this.postService.readPost(input);
  }

  @Mutation(() => Post)
  async createPost(@Args(input) input: PostInputType): Promise<Post> {
    return await this.postService.createPost(input);
  }

  @ResolveField('writer', () => User, {
    description: '게시글 작성자',
  })
  async readUser(@Parent() post: Post): Promise<User> {
    return await this.userService.readUserByOption({
      userId: post.writerId,
    });
  }
}
