import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IPost {
  @Field(() => Int, { description: '게시글의 id' })
  id: number;

  @Field(() => String, { description: '게시글의 제목' })
  title: string;

  @Field(() => String, { description: '게시글 내용' })
  content: string;
}

@ObjectType()
export class Post extends IPost {}

@InputType()
export class PostInputType extends IPost {}
