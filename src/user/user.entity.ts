import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Blog } from 'src/blog/blog.entity';
import { CommonEntity } from 'src/common/common.entity';
import { Post } from 'src/post/post.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  Relation,
  Unique,
} from 'typeorm';
import argon2 from 'argon2';
import { Resume } from 'src/resume/entities/resume.entity';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IUser extends CommonEntity {
  // TODO 길이 체크
  @Field(() => String, { description: '유저의 이름' })
  @Column({ type: 'varchar', length: 256, comment: '유저의 이름' })
  name: string;

  // TODO 이메일 형태 체크
  @Field(() => String, { description: '유저의 이메일' })
  @Column({
    type: 'varchar',
    length: 256,
    comment: '유저의 이메일',
  })
  email: string;

  // TODO 비밀번호 정규식 체크
  // 8자 이상 20자 이하 영문, 숫자, 특수문자가 각각 한개씩 >> /^(?=.[A-Za-z])(?=.\d)(?=.[!@#$%^&()-+=[]{};':"\|,.<>/?~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]{8,20}$/;
  // @Field(() => String, { description: '유저의 비밀번호' })
  @Column({
    type: 'varchar',
    length: 256,
    comment: '유저의 비밀번호',
  })
  password: string;

  @OneToMany(() => Post, (post) => post.writer, { nullable: true })
  @Field(() => [Post], { nullable: true })
  postList?: Array<Post>;

  @OneToOne(() => Blog, (blog) => blog.owner, { nullable: true })
  @Field(() => Blog, { nullable: true })
  blog?: Relation<Blog>;

  @OneToOne(() => Resume, (resume) => resume.owner, { nullable: true })
  @Field(() => Resume, { nullable: true })
  resume?: Relation<Resume>;
}

@ObjectType()
@Entity('user')
@Unique('unique_email_for_user', ['email']) // email을 unique키로 설정했고 중복인 경우 create에서 에러 메세지를 따로 처리하고 있다
export class User extends IUser {
  // TODO beforeInsert, beforeUpdate 비밀번호 암호화
  @BeforeInsert()
  @BeforeUpdate()
  /**
   * 해싱과 암호화의 차이
   *  - 해싱: 일방향 > 원래 값으로 복원 불가
   *  - 암호화: 양방향 > 암호화된 데이터가 복호화 필요할경우
   */
  async hashPassword() {
    if (this.password) {
      const hash = await argon2.hash(this.password);
      this.password = hash;
    }
  }
}

@InputType()
export class UserInputType extends IUser {
  // TODO 비밀번호 정규식 체크
  // 8자 이상 20자 이하 영문, 숫자, 특수문자가 각각 한개씩 >> /^(?=.[A-Za-z])(?=.\d)(?=.[!@#$%^&()-+=[]{};':"\|,.<>/?~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]{8,20}$/;
  @Field(() => String, { description: '유저의 비밀번호' })
  password: string;
}
