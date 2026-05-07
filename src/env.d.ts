/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_GIT_COMMIT?: string;
  readonly VITE_GITHUB_REPOSITORY_URL?: string;
  readonly VITE_PAYPAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface GPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

interface GPUAdapter {
  info?: GPUAdapterInfo;
  requestAdapterInfo?: () => Promise<GPUAdapterInfo>;
}

interface GPU {
  requestAdapter: () => Promise<GPUAdapter | null>;
}

interface Navigator {
  gpu?: GPU;
}
