import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { PostRepository } from './post.repository';
import { PostEventListener } from './post.event-listener';

@Module({
  imports: [UserModule],
  providers: [PostResolver, PostService, PostRepository, PostEventListener],
})
export class PostModule {}
