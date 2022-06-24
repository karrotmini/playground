export class HostnameAlreadyUsedError extends Error {
  constructor(hostname: string) {
    super(`호스트명이 이미 사용 중입니다. (hostname: ${hostname})`);
  }
}
