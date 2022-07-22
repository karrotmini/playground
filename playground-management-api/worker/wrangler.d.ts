/// <reference types="@cloudflare/workers-types" />

interface ServiceBinding {
  fetch: typeof fetch;
}

declare interface WranglerEnv {
  // vars
  HOSTNAME_PATTERN: string;
  CLOUDFLARE_CUSTOMHOST_ZONE_ID: string;

  // secrets
  CREDENTIAL_SECRET: string;
  CLOUDFLARE_CUSTOMHOST_ZONE_MANAGEMENT_KEY: string;

  // service bindings
  minictl: ServiceBinding;
  playground: ServiceBinding;
  bundleStorage: ServiceBinding;

  [key: string]: any;
}
