/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL_LOCAL: string;
  readonly VITE_API_URL_PRODUCTION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
