const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); //ป้องกันการยิง reqest มาเยอะๆ

//import config
const config = require('./config/index');

//import route
const shopRouter = require('./routes/shop');
const settingRouter = require('./routes/setting');
const userRouter = require('./routes/user');

//impoer errorHandler middleware
const passportJWT = require('./middlewares/passportJWT');
const errorHandler = require('./middlewares/errorHandler');


const app = express();

app.use(cors());
app.use(helmet());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
app.set('trust proxy', 1); //เปิด proxy
const limiter = rateLimit({
   windowMs: 10* 1000, // 10 วินาที
   max: 5 // limit each IP to 5 requests per windowMs
 });
  
 //  apply to all requests
 app.use(limiter);

//connect mongodb server
mongoose.connect(config.MONGODB_URI, {
   useNewUrlParser: true, // close warning mongodb when update 
   useCreateIndex: true
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use and init passport (ต้องใส่ก่อนroute เพื่อกันไม่ให้เข้า)
app.use(passport.initialize());

app.use('/api/shop', shopRouter);
app.use('/api/setting', passportJWT.isLogin, settingRouter);
app.use('/api/user', userRouter);


app.use(errorHandler);

module.exports = app;
