/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_MAP_KEY: string
    VITE_LOCAL_KEY: string
    VITE_KAKAO_LOGIN_CLIENT_ID: string
    VITE_KAKAO_LOGIN_CLIENT_SECRET: string
    VITE_KAKAO_REDIRECT_URI: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}