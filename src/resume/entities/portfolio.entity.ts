import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Resume } from './resume.entity';

// 포트폴리오 타입
export enum PORTFOLIO_TYPE {
  LINK = 'LINK',
  FILE = 'FILE',
}
registerEnumType(PORTFOLIO_TYPE, {
  name: 'PORTFOLIO_TYPE',
  description: '포트폴리오 타입',
  valuesMap: {
    LINK: {
      description: '링크',
    },
    FILE: {
      description: '파일',
    },
  },
});

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IPortfolio extends CommonEntity {
  @Column({ type: 'int', unsigned: true, comment: '정렬 순서' })
  @Field(() => Int, { description: '정렬 순서' })
  order: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '포트폴리오 타입',
    nullable: true,
  })
  @Field(() => PORTFOLIO_TYPE, {
    description: '포트폴리오 타입',
    nullable: true,
  })
  type?: PORTFOLIO_TYPE;

  @Column({ type: 'varchar', length: 255, comment: '포트폴리오 url' })
  @Field(() => String, { description: '포트폴리오 url' })
  url: string;

  // ============================ //
  // ===== 관계 표시용 필드 ===== //
  // ============================ //
  @Column({ type: 'uuid', name: 'resume_id', comment: '연결된 이력서의 id' })
  resumeId: string;

  @ManyToOne(() => Resume, (resume) => resume.educationList)
  @JoinColumn({ name: 'resume_id' })
  resume: Relation<Resume>;
}

@ObjectType()
@Entity('portfolio')
export class Portfolio extends IPortfolio {}

@InputType()
export class PortfolioInputType extends IPortfolio {}
