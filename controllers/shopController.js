//create shopController
const Shop = require('../models/shop');
const Menu = require('../models/menu')
const config = require('../config/index')

exports.index = async (req, res, next) => {
    const shop = await Shop.find().select('name photo location').sort({_id: -1});

    const shopWithPhotoDomain = await shop.map((shop, index) => {
        return {
            id: shop. _id,
            name: shop.name,
            photo: config.DOMAIN + 'images/' + shop.photo,
            location: shop.location
        }
    });

    return res.json({
        data: shopWithPhotoDomain
    });
}

//get menu with shop
exports.menu = async (req, res, next) => {
    // const menu = await Menu.find().select('+name -price'); 
    // const menu = await Menu.find().where('price').gte(150); // greater than ของmongoose
    // const menu = await Menu.find({price: {$gte: 150}}) // ของ mongo

    //menuนี้อยู่ร้านไหน
    const menu = await Menu.find().populate('shop', 'name location').sort({ _id: 1 }); //join collection ใช้ได้เมื่อทำ FK ตรง model ref: 'shop

    return res.json ({
        data : menu
    })
}

exports.getShopWithMenu = async (req, res, next) => {
    //ร้านนี้มี menu อะไร
    const shopWithMenu = await Shop.findOne({_id: req.params.id}).populate('menus');

    return res.json ({
        data : shopWithMenu
    })
}

//เพิ่มร้านอาหาร
exports.store = async (req, res, next) => {
    const shop = new Shop(req.body);
    await shop.save();

    return res.status(201).json({
        message: "add shop success"
    });
}
