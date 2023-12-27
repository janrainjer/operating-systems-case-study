export default () => ({
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000,
  ip: process.env.APP_IP,
  domain: process.env.DOMAIN_NAME,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: process.env.MINIO_USE_SSL
      ? process.env.MINIO_USE_SSL.toLowerCase() === "true"
      : false,
    bucket: process.env.MINIO_BUCKET_NAME,
  },
  oauth: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  credential: {
    jwt_secret: process.env.JWT_SECRET,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND
      ? parseInt(process.env.BCRYPT_SALT_ROUND, 10)
      : 12,
  },
});
