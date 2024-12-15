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

  @Field(() => Int, { description: '게시글 작성자의 id' })
  writerId: number;
}

@ObjectType()
export class Post extends IPost {}

@InputType()
export class PostInputType extends IPost {}
