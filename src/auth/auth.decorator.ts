import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

export type AccessRoleType = 'PUBLIC' | 'USER' | 'OPTIONAL';

export const AccessRole = (role?: AccessRoleType) =>
  SetMetadata('AccessRole', role || 'USER');

export type RequiredRelationsList = Array<'blog'>;

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
