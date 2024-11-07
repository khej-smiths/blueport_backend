import { Injectable } from '@nestjs/common';
import { Post, PostInputType } from './post.model';

@Injectable()
export class PostService {
  async createPost(input: PostInputType): Promise<Post> {
    return input;
  }
}
