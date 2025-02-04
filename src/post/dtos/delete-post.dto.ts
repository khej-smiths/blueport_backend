import { InputType, PickType } from '@nestjs/graphql';
import { PostInputType } from '../post.entity';

@InputType()
export class DeletePostInputDto extends PickType(PostInputType, ['id']) {}
