export type Bindings = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ENVIRONMENT: string;
};

export type Variables = {
  adminUser?: any;
  [key: string]: any;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: Variables;
};
