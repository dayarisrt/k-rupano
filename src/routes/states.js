const express = require('express');
const router = express.Router();
const State = require('../models/State');
const { isAuthenticated } = require('../helpers/auth');

//routes

router.get('/states', isAuthenticated, async (req, res) => {

    await State.find()
    .then(documentos => {
        const contexto = {
            states: documentos.map(documento => {
            return {
                _id: documento._id,
                description: documento.description,
                style: documento.style,
                date: documento.date
            }
            })
        } 
        
        res.render('states/index', { states: contexto.states });
    });
});

router.get('/states/create', isAuthenticated, async (req, res) =>{
    res.render('states/create');
});

router.post('/states/store', isAuthenticated, async (req, res) =>{
    const {description, style} = req.body;
    const errors = [];
    if(!description){
        errors.push({text: 'Debe ingresar una descripción'});
    }
    if(!style){
        errors.push({text: 'Debe ingresar un estilo'});
    }
    if(errors.length > 0){
        res.render('states/create',{
            errors,
            description,
            style
        });
    }else{
        const newState = new State({ description, style });
        await newState.save();
        req.flash('success_msg', 'Estado agregado exitosamente.');
        res.redirect('/states');
    }
})

router.get('/states/edit/:id', isAuthenticated, async (req, res) =>{

    await State.findById(req.params.id)
    .then(documento => {
        const state = {
            _id: documento._id,
            description: documento.description,
            style: documento.style
        }; 
          
        res.render('states/edit', { state }) 
    });
});

router.put('/states/update/:id', isAuthenticated, async (req, res) =>{
    const {description, style} = req.body;
    await State.findByIdAndUpdate(req.params.id, {description, style});
    req.flash('success_msg', 'Estado modificado exitosamente.');
    res.redirect('/states');
});

router.delete('/states/delete/:id', isAuthenticated, async (req, res) =>{
    await State.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Estado eliminado exitosamente.');
    res.redirect('/states');
});


module.exports = router;