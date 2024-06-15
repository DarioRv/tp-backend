const { PORT = 3000, MONGO_URL = 'http://localhost:27017/tp-back' } =
  process.env;

module.exports = { PORT, MONGO_URL };
