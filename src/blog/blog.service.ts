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
import { ReadBlogInputDto } from './dtos/read-blog.dto';

@Injectable()
@Wrapper()
export class BlogService {
  constructor(
    @InjectRepository(BlogRepository)
    private readonly blogRepository: BlogRepository,
    private readonly als: LoggerStorage,
  ) {}

  async createBlog(input: CreateBlogInputDto, user: User): Promise<Blog> {
    // ===== 에러 케이스 ===== //
    const ERR_ALREADY_BLOG = 'ERR_ALREADY_BLOG'; // 이미 블로그를 소유하고 있는 경우

    // ===== 이미 블로그를 소유하고 있는 경우 에러처리 ===== //
    if (user.blog) {
      throw new CustomGraphQLError('이미 소유하고 있는 블로그가 있습니다.', {
        extensions: {
          code: ERR_ALREADY_BLOG,
        },
      });
    }

    // ===== 블로그 생성 ===== //
    const blog = await this.blogRepository.createBlog(input, { id: user.id });

    // ===== 블로그 생성 결과 반환 ===== //
    return blog;
  }

  async updateBlog(input: UpdateBlogInputDto, user: User): Promise<Blog> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_NO_UPDATE = 'ERR_NO_UPDATE'; // 업데이트하지 못한 경우
    const ERR_NO_BLOG = 'ERR_NO_BLOG'; // 업데이트 할 블로그가 없는 경우

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
  }

  async readBlog(input: ReadBlogInputDto): Promise<Blog> {
    const ERR_NO_BLOG = 'ERR_NO_BLOG'; // 조회할 블로그가 없는 경우
    const ERR_MULTIPLE_BLOG = 'ERR_MULTIPLE_BLOG'; // 조회할 블로그가 여러 개인 경우

    const blogList = await this.blogRepository.readBlogList(input);

    if (blogList.length === 0) {
      throw new CustomGraphQLError('조회할 블로그가 없습니다.', {
        extensions: {
          code: ERR_NO_BLOG,
        },
      });
    } else if (blogList.length > 1) {
      throw new CustomGraphQLError('조회할 블로그가 여러 개입니다.', {
        extensions: {
          code: ERR_MULTIPLE_BLOG,
        },
      });
    }

    return blogList[0];
  }
}
