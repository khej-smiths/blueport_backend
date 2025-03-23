import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogInputDto } from './dtos/create-blog.dto';

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
}
