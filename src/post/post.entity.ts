import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IPost extends CommonEntity {
  @Field(() => String, { description: '게시글의 제목' })
  @Column({ type: 'varchar', length: 512, comment: '게시글의 제목' })
  title: string;

  @Field(() => String, { description: '게시글 내용' })
  @Column({ type: 'longtext', comment: '게시글 내용' })
  content: string;

  @Field(() => [String], { nullable: true, description: '게시글의 해시태그' })
  @Column({ type: 'json', nullable: true, name: 'hashtag_list' })
  hashtagList?: Array<string>;

  @Field(() => Int, { description: '조회수' })
  @Column({ type: 'int', unsigned: true, default: 0, comment: '조회수' })
  viewCount: number;

  @Column({ type: 'uuid', name: 'owner_id', comment: '게시글 작성자의 id' })
  ownerId: string;

  @Column({ type: 'uuid', name: 'blog_id', comment: '게시글 블로그의 id' })
  blogId: string;

  @Field(() => User, { description: '게시글 작성자 전체 정보' })
  @ManyToOne(() => User, (user) => user.postList)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}

@ObjectType()
@Entity('post')
export class Post extends IPost {}

@InputType()
export class PostInputType extends IPost {}
