import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

// API 접근 권한
export type AccessRoleType =
  | 'PUBLIC' // 누구나
  | 'USER' // 회원만
  | 'OPTIONAL'; // 누구나 가능하지만 회원인 경우 추가 작업 필요

export const AccessRole = (role?: AccessRoleType) =>
  SetMetadata('AccessRole', role || 'USER');

// API별 필요한 정보(유저와 관계가 있는)
export type RequiredRelationsList = Array<
  'blog' | 'resume' | 'resume.educationList' | 'resume.careerList'
>;

export const RequiredRelationList = (relationsList?: RequiredRelationsList) =>
  SetMetadata('RequiredRelationList', relationsList);

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    // * graphql context user
    const user: User = gqlContext?.user;

    return user;
  },
);
