import { defaultFieldResolver } from 'graphql';
import {
  type App,
} from '@karrotmini/playground-core/src/entities';

export type CreateAppResultRoot = {
  app: App,
};

export const app = defaultFieldResolver;
export const customHost = defaultFieldResolver;
export const userProfile = defaultFieldResolver;
