import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: '모든 페이징 처리를 위한 부모 클래스',
})
export abstract class IPagination {
  @Field(() => Int, { defaultValue: 10, description: '페이지 당 자료의 개수' })
  limit: number;

  @Field(() => Int, { defaultValue: 0, description: '페이지 번호' })
  pageNumber: number;
}
