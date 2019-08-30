const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: 'nopic.png' },
    location: { 
        lat: { type: Number },
        lgn: { type: Number }
    }
},{
    timestamps: true,
    collection: 'shops',
    toJSON: { virtuals: true}
});

//ค้นหาเมนู โดยมีเงื่อนไขว่า shop_id === Menu shop
// 1:N
schema.virtual('menus', {
    ref: 'Menu', // จะลิงก์ไปที่ไหน Menu
    localField: '_id', // _id ของ Shop (ไฟล์นี้)
    foreignField: 'shop' // ฟิลด์ของโมเดล Menu
});

const Shop = mongoose.model('Shop', schema);

module.exports = Shop;