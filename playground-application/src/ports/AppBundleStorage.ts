import {
  type AppBundle,
} from '@karrotmini/playground-core/src/entities';

// FIXME: 웹앱 컨트롤러 인터페이스로 기능 위임하기
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
