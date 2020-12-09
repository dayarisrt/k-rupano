const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//inicialization
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3010);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers:require('./helpers/general')
}));
app.set('view engine', '.hbs');

//midlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    var user_login = null;

    if(req.user){
    user_login = {
        _id: req.user._id,
        name: req.user.name,
        last_name: req.user.last_name,
        email: req.user.email,
        rol: req.user.rol
        } 
    }

    res.locals.user_login = user_login;

    next();
})

//routes
app.use(require('./routes/index'));
app.use(require('./routes/articles'));
app.use(require('./routes/users'));
app.use(require('./routes/states'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//server listenning
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});