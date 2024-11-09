import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post, PostInputType } from './post.model';
import { input } from 'src/common/consts';
import { PostService } from './post.service';
import { ReadPostInputDto } from './dtos/read-post.dto';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @Query(() => Post)
  async readPost(@Args(input) input: ReadPostInputDto): Promise<Post> {
    return await this.postService.readPost(input);
  }

  @Mutation(() => Post)
  async createPost(@Args(input) input: PostInputType): Promise<Post> {
    return await this.postService.createPost(input);
  }
}
