import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [PostResolver, PostService],
})
export class PostModule {}
