export class AppNameRequiredError extends Error {
  constructor() {
    super('앱 이름을 입력해주세요.');
  }
}
