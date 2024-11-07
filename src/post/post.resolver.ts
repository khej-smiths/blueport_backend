import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post, PostInputType } from './post.model';
import { input } from 'src/common/consts';
import { PostService } from './post.service';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @Query(() => Post)
  readPost(): Post {
    return {
      id: 1,
      title: '1',
      content: '1',
    };
  }

  @Mutation(() => Post)
  async createPost(@Args(input) input: PostInputType): Promise<Post> {
    return await this.postService.createPost(input);
  }
}
