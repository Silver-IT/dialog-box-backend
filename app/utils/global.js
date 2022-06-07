const url =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_URL
    : process.env.PRODUCTION_URL;

export const API_URL =
  process.env.NODE_ENV == "production"
    ? process.env.PRODUCTION_URL
    : process.env.NODE_ENV == "staging"
    ? process.env.STAGING_API_URL
    : process.env.DEVELOPMENT_API_URL;

global.SERVER_URL = url;
