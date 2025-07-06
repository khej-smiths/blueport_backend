import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IPagination } from 'src/common/parent-dto/pagination-dto';

/**
 * 게시글 정렬 조건 추가
 */
export enum SORT_OPTION {
  VIEW_COUNT,
  NEWEST,
}
registerEnumType(SORT_OPTION, { name: 'SORT_OPTION' });

@InputType()
export class ReadPostListInputDto extends IPagination {
  @Field(() => SORT_OPTION, {
    defaultValue: SORT_OPTION.NEWEST,
    description: '정렬조건',
  })
  sortOption: SORT_OPTION;

  @Field(() => String, {
    description:
      '조회할 블로그의 id, 없는 경우 전체 게시글을 기준으로 조회된다.',
    nullable: true,
  })
  blogId?: string;

  @Field(() => [String], { nullable: true, description: '게시글의 해시태그' })
  hashtagList?: Array<string>;
}
