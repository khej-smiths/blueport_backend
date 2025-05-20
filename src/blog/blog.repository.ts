import { Injectable } from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogInputDto } from './dtos/create-blog.dto';
import { UpdateBlogInputDto } from './dtos/update-blog.dto';

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
}
