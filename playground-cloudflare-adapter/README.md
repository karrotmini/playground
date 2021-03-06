# Karrotmini Playground Adapter to Cloudflare

[Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) & [Durable Objects](https://developers.cloudflare.com/workers/runtime-apis/durable-objects/) 백엔드로 구현된 Playground 어댑터

- In: Playground 서비스를 Cloudflare 인프라스트럭쳐(KV, Durable Objects)로 포팅합니다.
- Out: [Fetch API](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API) 기반 클라이언트를 제공합니다. [Service Bindings](https://developers.cloudflare.com/workers/platform/bindings/about-service-bindings/) Stub을 감싸서 사용합니다.

## Infrastructure

![Infrastructure Overview](_images/playground-cloudflare-infrastructure-overview.png)
[See on Excalidraw](https://excalidraw.com/#json=bgse0GaQT4xgha9bR7e9z,YKRMirhUr5y3FTmOy2CF6Q)

### Key Components

- **Event Store**: 글로벌 분산 스토리지인 *Cloudflare KV*에 발행된 이벤트를 모두 저장합니다. 애그리게잇 ID, 이벤트 명, 이벤트 날짜 기반으로 정렬된 키를 각각 보관하여 이론적으로 [Hexastore](http://karras.rutgers.edu/hexastore.pdf) 수준으로 인덱싱이 가능합니다.
  > **Warning**
  > Cloudflare KV 비용은 DO Transactional Storage 대비 [읽기의 경우 최소 2.5배, 쓰기의 경우 최소 5배 비쌉니다.](https://developers.cloudflare.com/workers/platform/pricing/#workers-kv)
  > DO는 작업 단위를 병합할 수도 있으므로 Hexastore 구현 시 쓰기 비용이 (30 * 이벤트 갯수)배 이상 차이날 수 있습니다.
  > 애초에 DO에선 Materialize가 쉬워서 별도의 인덱싱이 필요하지 않습니다.
  > 그럼에도 불구하고 KV를 사용하는 이유는 관리 편이성의 차이 때문이며 가까운 시일 내에 비용 문제로 마이그레이션 할 수 있습니다.
  >
  > 예상 비용 매트릭: U x C x E x 6 / month
  > (U: 고유 사용자 수, C: 사용자 당 커맨드 갯수 평균, E: 커맨드 당 이벤트 갯수 평균)
- **Aggregators**: 고유한 애그리게잇 ID 마다 스폰되는 *Durable Object*를 기반으로 애그리게이터 인터페이스를 구현합니다.
  - 동시에 한 군데서만 실행되는 것으로 애그리게잇 상태의 일관성을 보장합니다.
  - 일정시간동안 메모리에 상태가 보존되어 스토리지 요청 없이 빠르게 상태를 반환합니다.
  - 기본적으로 이벤트 스토어에서 상태를 복원하며 일정 주기로 [자체 스토리지](https://developers.cloudflare.com/workers/runtime-apis/durable-objects/#transactional-storage-api)에 저장한 스냅샷으로 더 빠르게 복원할 수 있습니다.
- **Event Bus**, **Projectors**: TBD
