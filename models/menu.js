const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Schema.Types.Decimal128 },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' } // อ้าง FK 
});

const Menu = mongoose.model('Menu', schema);

module.exports = Menu;