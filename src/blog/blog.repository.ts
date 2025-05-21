import { Injectable } from '@nestjs/common';
import {
  DataSource,
  FindOptionsWhere,
  FindManyOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogInputDto } from './dtos/create-blog.dto';
import { UpdateBlogInputDto } from './dtos/update-blog.dto';
import { ReadBlogInputDto } from './dtos/read-blog.dto';

@Injectable()
export class BlogRepository extends Repository<Blog> {
  constructor(private dataSource: DataSource) {
    super(Blog, dataSource.createEntityManager());
  }

  /**
   * @description 블로그 생성하기
   */
  async createBlog(
    input: CreateBlogInputDto,
    userInfo: { id: string },
  ): Promise<Blog> {
    const creation = this.create({ ...input, ownerId: userInfo.id });
    const blog = await this.save(creation);

    return blog;
  }

  /**
   * @description 블로그 정보 수정하기
   */
  async updateBlog(
    input: UpdateBlogInputDto,
    userInfo: { id: string },
  ): Promise<UpdateResult> {
    return await this.update(
      {
        ownerId: userInfo.id,
      },
      input,
    );
  }

  /**
   * @description 블로그 목록 조회하기
   */
  async readBlogList(option: ReadBlogInputDto): Promise<Array<Blog>> {
    const where: FindOptionsWhere<Blog> = {
      ...(option.id && { id: option.id }),
      ...(option.ownerId && { ownerId: option.ownerId }),
    };

    const findOption: FindManyOptions<Blog> = {
      where,
    };

    const blogList = await this.find(findOption);

    return blogList;
  }
}
