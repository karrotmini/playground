export class HostnameNotAvailableError extends Error {
  constructor(hostname: string) {
    super(`호스트명을 사용할 수 없습니다. (hostname: ${hostname})`);
  }
}
