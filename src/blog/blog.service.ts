import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';
import { BlogRepository } from './blog.repository';
import { Blog } from './blog.entity';
import { CreateBlogInputDto } from './dtos/create-blog.dto';
import { User } from 'src/user/user.entity';

@Injectable()
@Wrapper()
export class BlogService {
  constructor(
    @InjectRepository(BlogRepository)
    private readonly blogRepository: BlogRepository,
    private readonly als: LoggerStorage,
  ) {}

  async createBlog(input: CreateBlogInputDto, user: User): Promise<Blog> {
    // TODO 에러케이스 정리
    const ERR_CASE = 'ERR_CASE';

    try {
      const blog = await this.blogRepository.createBlog(input, { id: user.id });
      return blog;
    } catch (error) {
      throw error;
    }
  }
}
