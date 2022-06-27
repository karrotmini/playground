# Playground Management API

Playground 서비스를 관리할 수 있는 API 입니다.

- In: Cloudflare Workers 기반으로 Playground Management API 서비스를 제공합니다.
- Out: Fetch API 기반 클라이언트 SDK를 제공합니다. Fetch 클라이언트가 있는 Node.js, Deno, Cloudflare Workers 같은 다양한 환경에서 사용할 수 있습니다.

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
