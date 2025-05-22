import { InputType } from '@nestjs/graphql';
import { IPagination } from 'src/common/parent-dto/pagination-dto';

@InputType()
export class ReadBlogListInputDto extends IPagination {}
