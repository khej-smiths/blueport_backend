import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { CreatePostInputDto } from './dtos/create-post.dto';
import {
  DataSource,
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UpdatePostInputDto } from './dtos/update-post.dto';
import { User } from 'src/user/user.entity';
import { DeletePostInputDto } from './dtos/delete-post.dto';

type ReadPostOption = {
  id?: string;
  skip?: number;
  take?: number;
};

@Injectable()
export class PostRepository extends Repository<Post> {
  // constructor 로직의 경우 보여지는 코드 상으로 직접 사용하지는 않으나, 부모 클래스에 필요하다
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  /**
   * @description 게시글을 추가하기
   * @param option
   */
  async createPost(
    option: CreatePostInputDto,
    userInfo: { id: string },
  ): Promise<Post> {
    const creation = await this.create({ ...option, writerId: userInfo.id });
    const post = await this.save(creation);

    return post;
  }

  /**
   * @description 조건에 맞춰서 게시글 목록 조회하기
   * @param option
   * @returns
   */
  async readPostList(option: ReadPostOption): Promise<Array<Post>> {
    const where: FindOptionsWhere<Post> = {
      ...(option.id && { id: option.id }),
    };

    const findOption: FindManyOptions<Post> = {
      where,
      ...(option.skip && { skip: option.skip }),
      ...(option.take && { take: option.take }),
    };

    const postList = await this.find(findOption);

    return postList;
  }

  /**
   * @description 게시글 id를 받아서 게시글을 수정하기
   * @param option
   * @returns
   */
  async updatePost(
    option: UpdatePostInputDto,
    writer: User,
  ): Promise<UpdateResult> {
    const { id, ...content } = option;

    return await this.update({ id: option.id, writerId: writer.id }, content);
  }

  async deletePost(
    option: DeletePostInputDto,
    writer: User,
  ): Promise<[UpdateResult, QueryRunner]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return [
      await queryRunner.manager.softDelete(Post, {
        id: option.id,
        writerId: writer.id,
      }),
      queryRunner,
    ];
  }
}
