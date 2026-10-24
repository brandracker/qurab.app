export type Bindings = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ENVIRONMENT: string;
  GEMINI_API_KEY?: string;
  CHAT_ROOM?: DurableObjectNamespace;
};

export type Variables = {
  adminUser?: any;
  [key: string]: any;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: Variables;
};
