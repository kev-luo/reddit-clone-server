declare namespace NodeJS {
  export interface ProcessEnv {
    SESSION_SECRET: string;
    ETHEREAL_EMAIL: string;
    ETHEREAL_PW: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    CORS_ORIGIN: string;
  }
}
