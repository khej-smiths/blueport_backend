import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';
import { BlogRepository } from './blog.repository';
import { Blog } from './blog.entity';
import { CreateBlogInputDto } from './dtos/create-blog.dto';
import { User } from 'src/user/user.entity';
import { UpdateBlogInputDto } from './dtos/update-blog.dto';
import { CustomGraphQLError } from 'src/common/error';

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

  async updateBlog(input: UpdateBlogInputDto, user: User): Promise<Blog> {
    // 에러의 앞에 달 prefix 선언
    const errPrefix = `${this.constructor.name} - ${this.updateBlog.name}`;

    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_NO_UPDATE = 'ERR_NO_UPDATE'; // 업데이트하지 못한 경우
    const ERR_NO_BLOG = 'ERR_NO_BLOG'; // 업데이트 할 블로그가 없는 경우

    try {
      // 유저의 블로그가 없는 경우 에러처리
      if (!user.blog) {
        throw new CustomGraphQLError('업데이트 할 블로그가 없습니다.', {
          extensions: {
            code: ERR_NO_BLOG,
          },
        });
      }

      // 블로그 정보 업데이트
      const result = await this.blogRepository.updateBlog(input, {
        id: user.id,
      });

      // 블로그 업데이트 결과가 없는 경우 에러처리
      if (result.affected === 0) {
        throw new CustomGraphQLError('업데이트를 하지 못했습니다.', {
          extensions: {
            code: ERR_NO_UPDATE,
          },
        });
      }

      // 기존 유저 정보와 input 정보 조합해서 새로운 블로그 정보 바로 리턴
      return {
        ...user.blog,
        ...input,
      };
    } catch (error) {
      if (error.extensions.customFlag === true) {
        error.addBriefStacktraceToCode(errPrefix);
      }

      throw error;
    }
  }
}
