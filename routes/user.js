const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const passportJWT = require('../middlewares/passportJWT');

//localhost:3000/api/user/register
router.post('/register',
[
    body('name').not().isEmpty().withMessage('Please enter name'),

    body('email').not().isEmpty().withMessage('Please enter email')
    .isEmail().withMessage('Please enter valid email'),

    body('password').not().isEmpty().withMessage('Please enter name')
    .isLength({min: 3}).withMessage('ป้อนรหัสผ่านอย่างน้อย 3 ตัวอักษร')
    
], 
userController.register);

//localhost:3000/api/user/login
router.post('/login', userController.login);


//get profile
//localhost:3000/api/user/me
router.get('/me', passportJWT.isLogin, userController.me);

module.exports = router; 