const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');
const State = require('../models/State');
const { isAuthenticated } = require('../helpers/auth');

//routes

router.get('/articles/:id?', isAuthenticated, async (req, res) => {

    if(req.params.id){
        let filter_user = {user: req.user._id};
    }else{
        let filter_user = '';
    }
    await Article.aggregate([
        
        { $match : {user: req.user._id} },
        { $sort: {date: -1} },
        {
          "$lookup": {
            "from": "users",
            "localField": "user",
            "foreignField": "_id",
            "as": "userrelacion"
          }
        }
    ])
    .then(documentos => {
        const contexto = {
            articles: documentos.map(documento => {
            return {
                _id: documento._id,
                code: documento.code,
                title: documento.title,
                url_image: documento.url_image,
                state: documento.state,
                active: documento.active,
                done: documento.done,
                date: documento.date,
                user: documento.user,
                userrelacion: documento.userrelacion
            }
            })
        } 
        res.render('articles/index', { articles: contexto.articles });
    });
});

router.get('/articles/create', isAuthenticated, async (req, res) =>{
    const users_list = await User.find().sort({last_name: 'asc'})
    .then(documentos => {
        const contexto = {
            users: documentos.map(documento => {
            return {
                _id: documento._id,
                name: documento.name,
                last_name: documento.last_name
            }
            })
        }

        return contexto;
    });

    const states = await State.find()
    .then(documentos => {
        const contexto = {
            states: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description,
            }
            })
        }

        return contexto.states;
    });

    res.render('articles/create', { users_list: users_list.users, states: states });
});

router.post('/articles/store', isAuthenticated, async (req, res) =>{
    const {code, title, url_image, state, user} = req.body;
    const errors = [];
    if(!code){
        errors.push({text: 'Debe ingresar un código de arículo'});
    }
    if(!title){
        errors.push({text: 'Debe ingresar un título de arículo'});
    }
    if(!url_image){
        errors.push({text: 'Debe ingresar una url de imagen'});
    }
    if(!state){
        errors.push({text: 'Debe seleccionar un estado'});
    }
    if(!user){
        errors.push({text: 'Debe seleccionar un usuario'});
    }
    if(errors.length > 0){
        res.render('articles/create',{
            errors,
            code,
            title,
            url_image,
            state,
            user: documento.user
        });
    }else{
        const newArticle = new Article({ code, title, url_image, state, user });
        await newArticle.save();
        req.flash('success_msg', 'Artículo agregado exitosamente.');
        res.redirect('/articles');
    }
})

router.get('/articles/edit/:id', isAuthenticated, async (req, res) =>{
    const users_list = await User.find().sort({last_name: 'asc'})
    .then(documentos => {
        const contexto = {
            users: documentos.map(documento => {
            return {
                _id: documento._id,
                name: documento.name,
                last_name: documento.last_name
            }
            })
        }

        return contexto;
    });

    const states = await State.find()
    .then(documentos => {
        const contexto = {
            states: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description,
            }
            })
        }

        return contexto.states;
    });

    await Article.findById(req.params.id)
    .then(documento => {
        const article = {
            _id: documento._id,
            code: documento.code,
            title: documento.title,
            url_image: documento.url_image,
            state: documento.state,
            active: documento.active,
            done: documento.done,
            date: documento.date,
            user: documento.user
        }; 
          
        res.render('articles/edit', { article, users_list: users_list.users, states: states }) 
    });
});

router.get('/articles/resolve/:id', isAuthenticated, async (req, res) =>{
    const users_list = await User.find().sort({last_name: 'asc'})
    .then(documentos => {
        const contexto = {
            users: documentos.map(documento => {
            return {
                _id: documento._id,
                name: documento.name,
                last_name: documento.last_name
            }
            })
        }

        return contexto;
    });

    const states = await State.find()
    .then(documentos => {
        const contexto = {
            states: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description,
            }
            })
        }

        return contexto.states;
    });

    await Article.findById(req.params.id)
    .then(documento => {
        const article = {
            _id: documento._id,
            code: documento.code,
            title: documento.title,
            url_image: documento.url_image,
            state: documento.state,
            active: documento.active,
            done: documento.done,
            date: documento.date,
            user: documento.user
        }; 
          
        res.render('articles/resolve', { article, users_list: users_list.users, states: states }) 
    });
});

router.put('/articles/update/:id', isAuthenticated, async (req, res) =>{
    const {code, title, url_image, state, active, user} = req.body;
    await Article.findByIdAndUpdate(req.params.id, {code, title, url_image, state, active, user});
    req.flash('success_msg', 'Artículo modificado exitosamente.');
    res.redirect('/articles');
});

router.put('/articles/done/:id', isAuthenticated, async (req, res) =>{
    const {done} = req.body;
    const a = await Article.findByIdAndUpdate(req.params.id, {done});
    req.flash('success_msg', 'Artículo marcado como entregado.');
    res.redirect('/articles');
});

router.delete('/articles/delete/:id', isAuthenticated, async (req, res) =>{
    
    await Article.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Artículo eliminado exitosamente.');
    if(req.body.back_route){
        res.redirect(req.body.back_route);
    }
    res.redirect('/articles');
});


module.exports = router;