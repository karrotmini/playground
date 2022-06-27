# Distribution: Playground Management API

Playground 서비스를 관리할 수 있는 API 입니다.

## 클라이언트 사용하기

```bash
yarn add @karrotmini/playground-management-api@alpha
```

```ts
import { PlaygroundManagementAPI } from '@karrotmini/playground-management-api';

new PlaygroundManagementAPI({
  baseUrl: new URL('https://playground-management-api.internal.karrotmini.dev'),
  fetch,
});
```
