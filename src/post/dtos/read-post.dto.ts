import { InputType, PickType } from '@nestjs/graphql';
import { PostInputType } from '../post.model';

@InputType()
export class ReadPostInputDto extends PickType(PostInputType, ['id']) {}
