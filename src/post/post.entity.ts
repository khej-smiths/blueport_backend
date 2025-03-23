import { Field, InputType, ObjectType } from '@nestjs/graphql';
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

  @Column({ type: 'uuid', name: 'writer_id', comment: '게시글 작성자의 id' })
  writerId: string;

  @Field(() => User, { description: '게시글 작성자 전체 정보' })
  @ManyToOne(() => User, (user) => user.postList)
  @JoinColumn({ name: 'writer_id' })
  writer: User;
}

@ObjectType()
@Entity('post')
export class Post extends IPost {}

@InputType()
export class PostInputType extends IPost {}
