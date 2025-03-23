import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';

@Module({
  providers: [BlogService, BlogRepository],
})
export class BlogModule {}
