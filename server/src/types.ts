export type Bindings = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ENVIRONMENT: string;
};

export type AppContext = {
  Bindings: Bindings;
};
