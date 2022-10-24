/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_MAP_KEY: string
    VITE_LOCAL_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}