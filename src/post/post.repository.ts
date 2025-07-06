import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { CreatePostInputDto } from './dtos/create-post.dto';
import {
  DataSource,
  FindManyOptions,
  QueryRunner,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UpdatePostInputDto } from './dtos/update-post.dto';
import { User } from 'src/user/user.entity';
import { DeletePostInputDto } from './dtos/delete-post.dto';

type ReadPostOption = {
  skip?: number;
  take?: number;
  order?: {
    // 정렬은 어떻게 될 지 모르기때문에 Post 키 값 전체 받는 것으로 타입 지정
    [P in keyof Post]?: 'ASC' | 'DESC';
  };
  // where는 postId, blogId로만 제한
  where?: Partial<Record<'id' | 'blogId', string>>;
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
    userInfo: { id: string; blogId: string },
  ): Promise<Post> {
    const creation = await this.create({
      ...option,
      ownerId: userInfo.id,
      blogId: userInfo.blogId,
    });
    const post = await this.save(creation);

    return post;
  }

  /**
   * @description 조건에 맞춰서 게시글 목록 조회하기
   * @param option
   * @returns
   */
  async readPostList(option: ReadPostOption): Promise<Array<Post>> {
    const findOption: FindManyOptions<Post> = {
      ...(option.where && { where: option.where }),
      // 페이징 처리에 필요한 조건
      ...(option.skip && { skip: option.skip }),
      ...(option.take && { take: option.take }),
      // 게시글 정렬 조건
      ...(option.order && { order: option.order }),
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

    return await this.update({ id: option.id, ownerId: writer.id }, content);
  }

  async increaseViewCount(postId: string): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update(Post)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('id = :id', { id: postId })
      .execute();
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
        ownerId: writer.id,
      }),
      queryRunner,
    ];
  }

  /**
   * @description 게시글의 해시태그 목록만 가져와서 리턴(중복 제거)
   */
  async readHashtagList(): Promise<Array<string>> {
    const hashtagSet = new Set();

    await (
      await this.find({ select: ['hashtagList'] })
    ).forEach((elem) =>
      elem.hashtagList?.forEach((hashtag) => hashtagSet.add(hashtag)),
    );

    return [...hashtagSet] as Array<string>;
  }
}
