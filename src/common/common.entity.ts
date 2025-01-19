import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export abstract class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'id' })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date, { description: '데이터의 생성 날짜' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date, { description: '데이터의 업데이트 날짜' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Field(() => Date, {
    description: '데이터의 삭제 날짜(soft)',
    nullable: true,
  })
  deletedAt?: Date;
}
