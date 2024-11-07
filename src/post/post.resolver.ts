import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post, PostInputType } from './post.model';
import { input } from 'src/common/consts';

@Resolver('Post')
export class PostResolver {
  @Query(() => Post)
  readPost(): Post {
    return {
      id: 1,
      title: '1',
      content: '1',
    };
  }

  @Mutation(() => Post)
  createPost(@Args(input) input: PostInputType): Post {
    return {
      id: 1,
      title: '1',
      content: '1',
    };
  }
}
