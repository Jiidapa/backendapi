const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, index: true }, //do not duplicate and set email is index
    password: { type: String, required: true, trim: true },
    role: { type: String, default: 'member' }
});

schema.methods.encryptPassword = async function (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

schema.methods.validPassword = async function (password) {
    const isLogin = await bcrypt.compare(password, this.password); //this.password อ้างถึง field ใน schema
    return isLogin;
}

const User = mongoose.model('User', schema);

module.exports = User;