import {
  type Bundle,
  type CustomHost,
} from '@karrotmini/playground-core/src/entities';

// FIXME: 웹앱 컨트롤러 인터페이스로 기능 위임하기
export interface IBundleStorage {
  connectBundleHost(props: {
    bundle: Bundle,
    customHost: CustomHost,
  }): Promise<void>;

  uploadBundleContent(props: {
    bundle: Bundle,
    content: ReadableStream,
  }): Promise<void>;
}
