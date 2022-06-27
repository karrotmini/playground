/// <reference types="@cloudflare/workers-types" />

interface ServiceBinding {
  fetch: typeof fetch;
}

declare interface WranglerEnv {
  playground: ServiceBinding;
}
