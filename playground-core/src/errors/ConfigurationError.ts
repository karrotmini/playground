export class ConfigurationError extends TypeError {
  constructor(hint: string) {
    // Note: 환경설정이나 의존성 주입이 제대로 안된 경우
    super(`invalid config: ${hint}`);
  }
}
