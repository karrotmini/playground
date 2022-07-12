/// <reference types="@cloudflare/workers-types" />

declare interface WranglerEnv {
  // KVs
  KV_EVENT_STORE: KVNamespace;

  // DOs
  DO_App: DurableObjectNamespace;
  DO_BundleUpload: DurableObjectNamespace;
  DO_CustomHost: DurableObjectNamespace;
  DO_UserProfile: DurableObjectNamespace;
}
