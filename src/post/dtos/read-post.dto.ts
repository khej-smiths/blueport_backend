import { InputType, PickType } from '@nestjs/graphql';
import { PostInputType } from '../post.entity';

@InputType()
export class ReadPostInputDto extends PickType(PostInputType, ['id']) {}
