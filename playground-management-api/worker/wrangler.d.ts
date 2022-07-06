/// <reference types="@cloudflare/workers-types" />

interface ServiceBinding {
  fetch: typeof fetch;
}

declare interface WranglerEnv {
  // vars
  HOSTNAME_PATTERN: string;
  CLOUDFLARE_CUSTOMHOST_ZONE_ID: string;

  // secrets
  MANAGEMENT_KEY: string;
  CREDENTIAL_SECRET: string;
  CLOUDFLARE_CUSTOMHOST_ZONE_MANAGEMENT_KEY: string;

  // service bindings
  playground: ServiceBinding;

  [key: string]: any;
}
