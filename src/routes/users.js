const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rol = require('../models/Rol');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');

//routes
router.get('/users', isAuthenticated, async (req, res) => {
    await User.find()
    .then(documentos => {
        const contexto = {
            users: documentos.map(documento => {
            return {
                _id: documento._id,
                dni: documento.dni,
                name: documento.name,
                last_name: documento.last_name,
                email: documento.email,
                user_name: documento.user_name,
                pass: documento.pass,
                date: documento.date,
                rol: documento.rol
            }
            })
        }
        res.render('users/index', { users: contexto.users }) 
    });
});

router.get('/users/signin',(req, res) =>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/articles',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', async (req, res) =>{
    const roles_list = await Rol.find()
    .then(documentos => {
        const contexto = {
            roles: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description
            }
            })
        }

        return contexto;
    });

    res.render('users/signup', { roles_list: roles_list.roles });
});

router.post('/users/store', async (req, res) =>{
    const { dni, name, last_name, email, user_name, pass, rol } = req.body;
    const errors = [];
    if(!dni){
        errors.push({text: 'Debe ingresar un DNI'});
    }
    if(!name){
        errors.push({text: 'Debe ingresar un nombre'});
    }
    if(!last_name){
        errors.push({text: 'Debe ingresar un apellido'});
    }
    if(!user_name){
        errors.push({text: 'Debe ingresar un nombre de usuario'});
    }
    if(!pass){
        errors.push({text: 'Debe ingresar una contraseña'});
    }
    if(!email){
        errors.push({text: 'Debe ingresar una contraseña'});
    }

    const user_email = await User.findOne({email: email});

    if(user_email){
        errors.push({text: 'Ya existe otro usuario con este email'});
    }
    if(!rol){
        errors.push({text: 'Debe seleccionar un rol'});
    }
    if(errors.length > 0){
        res.render('users/signup',{
            errors,
            dni,
            name,
            last_name,
            email,
            user_name,
            pass,
            rol
        });
    }else{
        const newUser = new User({ dni, name, last_name, email, user_name, pass, rol});
        newUser.pass = await newUser.encryptPassword(pass);
        await newUser.save();
        req.flash('success_msg', 'Usuario agregado exitosamente.');
        res.redirect('/users');
    }
});

router.get('/users/logout',(req, res) =>{
    req.logOut();
    res.redirect('/articles');
});

router.get('/users/edit/:id', isAuthenticated, async (req, res) =>{
    const roles_list = await Rol.find()
    .then(documentos => {
        const contexto = {
            roles: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description
            }
            })
        }

        return contexto;
    });

    await User.findById(req.params.id)
    .then(documento => {
        const user = {
            _id: documento._id,
            dni: documento.dni,
            name: documento.name,
            last_name: documento.last_name,
            email: documento.email,
            user_name: documento.user_name,
            pass: documento.pass,
            date: documento.date,
            rol: documento.rol
        }; 
        
        res.render('users/edit', { user, roles_list: roles_list.roles }) 
    });
});

router.put('/users/update/:id', isAuthenticated, async (req, res) =>{
    const {dni, name, last_name, email, user_name, pass, rol} = req.body;
    await User.findByIdAndUpdate(req.params.id, {dni, name, last_name, email, user_name, pass, rol});
    req.flash('success_msg', 'Usuario modificado exitosamente.');
    res.redirect('/users');
});

router.delete('/users/delete/:id', isAuthenticated, async (req, res) =>{
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Usuario eliminado exitosamente.');
    res.redirect('/users');
});

//roles

router.get('/users/roles', isAuthenticated, async (req, res) => {
    await Rol.find()
    .then(documentos => {
        const contexto = {
            roles: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description,
                detail: documento.detail,
                date: documento.date,
            }
            })
        }
        
        res.render('users/roles', { roles: contexto.roles }) 
    });
});

router.get('/users/roles/create', isAuthenticated, async (req, res) =>{
    
    res.render('users/roles/create');
});

router.post('/users/roles/store', isAuthenticated, async (req, res) =>{
    const {description, detail} = req.body;
    const errors = [];
    if(!description){
        errors.push({text: 'Debe ingresar una descripción'});
    }
    if(!detail){
        errors.push({text: 'Debe ingresar un detalle'});
    }
    if(errors.length > 0){
        res.render('users/roles/create',{
            errors,
            description,
            detail
        });
    }else{
        const newRol = new Rol({ description, detail });
        await newRol.save();
        req.flash('success_msg', 'Rol agregado exitosamente.');
        res.redirect('/users/roles');
    }
});

router.get('/users/roles/edit/:id', isAuthenticated, async (req, res) =>{
    
    await Rol.findById(req.params.id)
    .then(documento => {
        const rol = {
            _id: documento._id,
            description: documento.description,
            detail: documento.detail
        }; 
       
        res.render('users/roles/edit', { rol }) 
    });
});

router.put('/users/roles/update/:id', isAuthenticated, async (req, res) =>{
    const {description, detail} = req.body;
    await Rol.findByIdAndUpdate(req.params.id, {description, detail});
    req.flash('success_msg', 'Rol modificado exitosamente.');
    res.redirect('/users/roles');
});

router.delete('/users/roles/delete/:id', isAuthenticated, async (req, res) =>{
    await Rol.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Rol eliminado exitosamente.');
    res.redirect('/users/roles');
});

module.exports = router;