import {
  type AppBundle,
} from '@karrotmini/playground-core/src/entities';

export interface IAppBundleStorage {
  writeIndex(props: {
    appBundle: AppBundle,
    hostname: string,
  }): Promise<void>;

  uploadContent(props: {
    appBundle: AppBundle,
    content: ReadableStream,
  }): Promise<void>;
}
