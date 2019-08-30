const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/index');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (!user) {
            return done(new Error('ไม่พบผู้ใช้ในระบบTT'), null); //ใช้method done แทนthrow
        }
        return done(null, user);
    }
    catch (error) {
        done(error);
    }
}));

module.exports.isLogin = passport.authenticate('jwt', {session: false})