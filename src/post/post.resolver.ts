import { Resolver, Query } from '@nestjs/graphql';
import { PostObjectType } from './post.model';

@Resolver()
export class PostResolver {
  @Query(() => PostObjectType)
  readPost(): PostObjectType {
    return {
      id: 1,
      title: '1',
      content: '1',
    };
  }
}
