import { Injectable } from '@nestjs/common';
import { Post, PostInputType } from './post.model';
import { ReadPostInputDto } from './dtos/read-post.dto';

@Injectable()
export class PostService {
  async readPost(input: ReadPostInputDto): Promise<Post> {
    return {
      id: input.id,
      title: 'title',
      content: 'content',
    };
  }

  async createPost(input: PostInputType): Promise<Post> {
    return input;
  }
}
