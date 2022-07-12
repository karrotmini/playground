import { defaultFieldResolver } from 'graphql';
import {
  type App,
  type CustomHost,
  type UserProfile,
} from '@karrotmini/playground-core/src/entities';

export type Root = {
  app: App,
  customHost: CustomHost,
  userProfile: UserProfile,
};

export const app = defaultFieldResolver;
export const customHost = defaultFieldResolver;
export const userProfile = defaultFieldResolver;
