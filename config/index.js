const dotenv = require('dotenv');

dotenv.config(); //ดึงไฟล์ .env

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    DOMAIN: process.env.DOMAIN,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET
}