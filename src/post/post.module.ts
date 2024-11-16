import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { PostRepository } from './post.repository';

@Module({
  imports: [UserModule],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
