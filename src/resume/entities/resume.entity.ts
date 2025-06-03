import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { Education } from './education.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  OneToOne,
  JoinColumn,
  Relation,
  Column,
  OneToMany,
} from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IResume extends CommonEntity {
  @OneToOne(() => User, (user) => user.blog)
  @JoinColumn({ name: 'owner_id' })
  @Field(() => User, { description: '이력서 주인 전체 정보' })
  owner: Relation<User>;

  @Column({
    type: 'uuid',
    name: 'owner_id',
    comment: '이력서 주인의 id',
    unique: true,
  })
  @Field(() => String, { description: '이력서 주인의 id' })
  ownerId: string;

  @OneToMany(() => Education, (edu) => edu.resume, { nullable: true })
  @Field(() => [Education], { nullable: true, description: '경력' })
  educationList?: Array<Education>;
}

@ObjectType()
@Entity('resume')
export class Resume extends IResume {
  // 학력
  // 경력
  // 프로젝트
  // 포트폴리오
}
