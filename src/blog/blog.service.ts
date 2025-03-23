import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';
import { BlogRepository } from './blog.repository';

@Injectable()
@Wrapper()
export class BlogService {
  constructor(
    @InjectRepository(BlogRepository)
    private readonly blogRepository: BlogRepository,
    private readonly als: LoggerStorage,
  ) {}
}
