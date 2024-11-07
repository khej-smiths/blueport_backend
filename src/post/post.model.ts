import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class Post {
  @Field(() => Int, { description: '게시글의 id' })
  id: number;

  @Field(() => String, { description: '게시글의 제목' })
  title: string;

  @Field(() => String, { description: '게시글 내용' })
  content: string;
}

@ObjectType()
export class PostObjectType extends Post {}
