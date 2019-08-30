const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index')

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const errorValidation = validationResult(req);
        if(!errorValidation.isEmpty()){
            const error = new Error('เกิดข้อผิดพลาดจากข้อมูลที่ส่งมา');
            error.statusCode = 422;
            error.validation = errorValidation.array();
            throw error; //เข้าcatch
        }

        //check duplicate email
        const exiextEMail = await User.findOne({ email: email });
        if (exiextEMail) {
            const error = new Error('exist email');
            error.statusCode = 403;
            throw error; //เข้าcatch
        }

        let user = new User();
        user.name = name;
        user.email = email;
        user.password = await user.encryptPassword(password);
        await user.save();

        return res.status(201).json({
            message: "add user success"
        });
    }
    catch (error) {
        next(error); //โยนด้วยคำสั่ง next
    }
}

exports.login = async (req, res, next) => {
    try{
        //นำ email และ password จาก req.body (destructuring)
        const { email, password} = req.body
        //นำ email ไปตรวจสอบว่ามีในระบบหรือไม่ ถ้าไม่มีโยน 401 บอกว่า ไม่พบผู้ใช้ในระบบ
        const user = await User.findOne({email: email});
        if(!user){ //ถ้าไม่มี user
            const error = new Error('ไม่พบผู้ใช้ในระบบ');
            error.statusCode = 401;
            throw error;
        }

        //ถ้ามีอยู่ให้ตรวจสอบรหัสผ่าน ถ้ารหัสผ่านไม่ถูกต้อง ให้ 401 บอกว่า รหัสผ่านไม่ถูกต้อง
        const validPassword = await user.validPassword(password);
        if(!validPassword){
            const error = new Error('รหัสผ่านไม่ถูกต้อง');
            error.statusCode = 401;
            throw error;
        }

        //สร้าง token
        const payload = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(payload, config.JWT_SECRET, {expiresIn: '5 days'});

        //decode expireIn
        const expire_in = jwt.decode(token); 

        //ส่ง token ไปให้ผู้ใช้
        return res.json({
            access_token : token,
            expire_in: expire_in.exp,
            token_type: 'Bearer'
        })
    }
    catch(error){
        next(error);
    }
}

exports.me = async(req, res, next) => {
    return res.json({
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
}
