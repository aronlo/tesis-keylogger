var express = require('express');
var router = express.Router();
const User = require('../models/user');

router.post('/login', (req, res) => {

    User.findOne({
        email: req.body.email,
        password: req.body.password})

        .exec((err, doc) => {
            var response = {}
            if(doc == null){
               response.status = 0
            } else{
                response.status = 1
                response.data = doc
            }
            res.json(response)
        })
    
})

router.post('/signup', (req, res) => {
    var new_user = new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
        genre: req.body.genre,
        handedness: req.body.handedness,
        handDesease: req.body.handDesease,
        userAgent: req.useragent.browser + "_" + req.useragent.os
    })

    if(req.useragent.isMobile){
        var response = {}
        response.status = 0
        response.error = 'Hacer las pruebas desde un computador, no en el celular.'
        res.json(response)
    } else{
        new_user.save((err, doc) => {
            var response = {}
            if (doc == null) {
                response.status = 0
                response.error = 'Error en el mongo server.'
            } else {
                response.status = 1
                response.data = doc
            }
            res.json(response)
        })
    }
})

module.exports = router