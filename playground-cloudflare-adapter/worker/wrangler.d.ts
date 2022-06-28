/// <reference types="@cloudflare/workers-types" />

declare interface WranglerEnv {
  // KVs
  KV_EVENT_STORE: KVNamespace;

  // DOs
  DO_APP_REPOSITORY: DurableObjectNamespace;
  DO_USER_PROFILE_REPOSITORY: DurableObjectNamespace;
}
