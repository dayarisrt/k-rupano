const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

//routes
router.get('/', async (req, res) =>{
    //const articles = await Article.find().sort({date: 'desc'})
    const articles = await Article.aggregate([
        { $sort: {date: -1} },
        {
          "$lookup": {
            "from": "users",
            "localField": "user",
            "foreignField": "_id",
            "as": "userrelacion"
          }
        },
        {   $unwind:"$userrelacion" },
        {
            "$lookup": {
              "from": "states",
              "localField": "state",
              "foreignField": "_id",
              "as": "staterelacion"
            }
          },
          {   $unwind:"$staterelacion" }
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
                userrelacion:  documento.userrelacion,
                staterelacion:  documento.staterelacion
                    
                //documento.userrelacion
            }
            })
        }
        
        return contexto.articles; 
    });
   
    res.render('index', { articles: articles });
})

module.exports = router;