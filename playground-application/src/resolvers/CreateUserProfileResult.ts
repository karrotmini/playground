import { defaultFieldResolver } from 'graphql';
import {
  type UserProfile,
} from '@karrotmini/playground-core/src/entities';

export type Root = {
  userProfile: UserProfile,
};

export const userProfile = defaultFieldResolver;

export * from './CreateUserProfileResult.createApp';
