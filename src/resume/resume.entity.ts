import { InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IResume extends CommonEntity {
  // 학력
  // 경력
  // 프로젝트
  // 포트폴리오
}
