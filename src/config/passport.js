const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Rol = require('../models/Rol');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: "pass"
}, async (email, pass, done) => {
   let user = await User.findOne({email: email});
   let rol = await Rol.findOne({_id: user.rol});

   if(!user){
       return done(null, false, {message: 'Usuario no encontrado!'});
   }else{
       const match = await user.matchPassword(pass);

       if(match){
           return done(null, user);
       }else{
           return done(null, false, {message: 'Clave inválida!'});
       }
   }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});