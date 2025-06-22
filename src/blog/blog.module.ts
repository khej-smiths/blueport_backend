import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { BlogResolver } from './blog.resolver';
import { ResumeModule } from 'src/resume/resume.module';

@Module({
  imports: [ResumeModule],
  providers: [BlogResolver, BlogService, BlogRepository],
})
export class BlogModule {}
