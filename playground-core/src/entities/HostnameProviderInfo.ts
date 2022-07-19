export type HostnameProviderInfoPayload = {
  hostname: string,
  healthCheckUrl: string,
  managementUrl: string,
};

export class HostnameProviderInfo {
  #hostname: string;
  #healthCheckUrl: URL;
  #managementUrl: URL;

  get hostname() {
    return this.#hostname;
  }

  get healthCheckUrl() {
    return this.#healthCheckUrl;
  }

  get managementUrl() {
    return this.#managementUrl;
  }

  constructor(payload: HostnameProviderInfoPayload) {
    this.#hostname = payload.hostname;
    this.#healthCheckUrl = new URL(payload.healthCheckUrl);
    this.#managementUrl = new URL(payload.managementUrl);
  }

  toJSON(): Readonly<HostnameProviderInfoPayload> {
    return Object.freeze({
      hostname: this.hostname,
      healthCheckUrl: this.healthCheckUrl.toJSON(),
      managementUrl: this.managementUrl.toJSON(),
    });
  }
}
