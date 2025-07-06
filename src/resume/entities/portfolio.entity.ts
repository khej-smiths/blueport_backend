import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IPortfolio {
  @Column({ type: 'int', unsigned: true, comment: '정렬 순서' })
  @Field(() => Int, { description: '정렬 순서' })
  order: number;

  @Column({ type: 'varchar', length: 255, comment: '포트폴리오 url' })
  @Field(() => String, { description: '포트폴리오 url' })
  url: string;
}

@ObjectType()
export class Portfolio extends IPortfolio {}

@InputType()
export class PortfolioInputType extends IPortfolio {}
