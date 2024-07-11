const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS
};
