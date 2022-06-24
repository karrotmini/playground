export class InvariantError extends TypeError {
  constructor(hint: string) {
    // Note: 데이터 정합성이 깨지거나, 로직을 치명적으로 잘못 작성한 경우
    super(`invariant: ${hint}`);
  }
}
