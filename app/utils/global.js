
const url = process.env.NODE_ENV === "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL
global.SERVER_URL = url;
