export class ReservedAppIdError extends Error {
  constructor(keywords: string[]) {
    super(`앱 ID로 사용할 수 없는 단어에요. (keywords: ${keywords.join(', ')})`);
  }
}
