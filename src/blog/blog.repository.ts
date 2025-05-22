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

type ReadBlogOption = {
  id?: string; // 블로그 아이디
  ownerId?: string; // 블로그 주인 아이디
  skip?: number;
  take?: number;
  order?: {
    [P in keyof Blog]?: 'ASC' | 'DESC';
  };
};

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
  async readBlogList(option: ReadBlogOption): Promise<Array<Blog>> {
    const where: FindOptionsWhere<Blog> = {
      ...(option.id && { id: option.id }),
      ...(option.ownerId && { ownerId: option.ownerId }),
    };

    const findOption: FindManyOptions<Blog> = {
      where,
      // 페이징 처리에 필요한 조건
      ...(option.skip && { skip: option.skip }),
      ...(option.take && { take: option.take }),
      // 게시글 정렬 조건
      ...(option.order && { order: option.order }),
    };

    const blogList = await this.find(findOption);

    return blogList;
  }
}
