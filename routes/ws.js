var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Record = require('../models/record');
var mongoose = require('mongoose');
var {random_user_assignation} = require('../utils')
var {sendEmail} = require('../mailer');
var moment = require('moment');

router.get('/time', (req, res) => {
    var currentTime = new Date
    res.json({
        timeToString: currentTime.toString(),
        time: currentTime
    })
})

router.get('/status', (req, res) => {
    var currentTime = new Date
    // 0: disconnected
    // 1: connected
    // 2: connecting
    // 3: disconnecting
    res.json({
        mongo: mongoose.connection.readyState
    })
})

router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username,
        password: req.body.password
    })
        .exec((err, userDoc) => {
            var response = {}
            if (userDoc == null) {
                response.status = 0
                response.error = "No se encontró ningun usuario con los datos enviados en la base de datos. Revisa tu correo para ver las credenciales."
                res.json(response)
            } else {
                //Check if already exist records
                Record.find({
                    belongedUserId: userDoc._id,
                    performedUserId: userDoc._id,
                    date: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    }
                }).exec((err, recordDocs) => {
                    if (recordDocs.length == 0) {
                        var new_record = new Record({
                            belongedUserId: userDoc._id,
                            performedUserId: userDoc._id,
                            date: new Date,
                            sessionIndex: 0,
                            valid: true,
                            username: userDoc.username,
                            password: userDoc.password,
                            rawUsernameKeydown: req.body.rawUsernameKeydown,
                            rawUsernameKeyup: req.body.rawUsernameKeyup,
                            rawPasswordKeydown: req.body.rawPasswordKeydown,
                            rawPasswordKeyup: req.body.rawPasswordKeyup,
                        })

                        new_record.save((err, doc) => {
                            req.session.user = userDoc

                            // This user won't have to log in for a year
                            req.session.cookie.maxAge = 24 * 60 * 60 * 1000;

                            response.status = 1
                            response.data = userDoc
                            res.json(response)
                        })

                    } else if ( recordDocs.length < 3) {
                        var lastRecord = recordDocs.slice(-1)[0]
                        var new_record = new Record({
                            belongedUserId: userDoc._id,
                            performedUserId: userDoc._id,
                            date: new Date,
                            sessionIndex: lastRecord.sessionIndex + 1,
                            valid: true,
                            username: userDoc.username,
                            password: userDoc.password,
                            rawUsernameKeydown: req.body.rawUsernameKeydown,
                            rawUsernameKeyup: req.body.rawUsernameKeyup,
                            rawPasswordKeydown: req.body.rawPasswordKeydown,
                            rawPasswordKeyup: req.body.rawPasswordKeyup,
                        })

                        new_record.save((err, doc) => {
                            req.session.user = userDoc

                            // This user won't have to log in for a year
                            req.session.cookie.maxAge = 24 * 60 * 60 * 1000;

                            response.status = 1
                            response.data = userDoc
                            res.json(response)
                        })
                    } else {
                        response.status = 0
                        response.error = "Se alcanzó el maximo de intentos permitidos por día."
                        res.json(response)
                    }
                })

            }

        })
})

router.post('/signup', (req, res) => {
    var response = {}
    if (req.useragent.isMobile) {
        response.status = 0
        response.error = 'Hacer las pruebas desde un computador, no en el celular.'
        res.json(response)
    } else {
        User.findOne({
            username: req.body.username
        }).exec((err, userDoc) => {
            if (userDoc == null) {

                var new_user = new User({
                    name: req.body.name,
                    lastname: req.body.lastname,
                    age: req.body.age,
                    email: req.body.email,
                    username: req.body.username,
                    password: random_user_assignation() == 'imposed' ? process.env.IMPOSED_PASS : req.body.password,
                    originalPassword: req.body.password,
                    genre: req.body.genre,
                    handedness: req.body.handedness,
                    handDesease: req.body.handDesease,
                    date: new Date,
                    ipAddress: req.body.ip_address,
                    userAgent: req.useragent.browser + "_" + req.useragent.os
                })

                new_user.save((err, doc) => {
                    if (doc == null) {
                        response.status = 0
                        response.error = 'Error en el mongo server. Contactarse al 959291344.'
                    } else {
                        response.status = 1
                        response.msg = `Se envió al correo ${doc.email} las credenciales con las que accederás al sistema.`
                        response.data = doc

                        //Envio de correo
                        sendEmail(doc.email, 
                            doc.username,
                            doc.password)
                    }
                    res.json(response)
                })
            } else {
                response.status = 0
                response.error = 'El usuario ' + req.body.username + " ya existe en la base de datos. Contactarse al 959291344."
                res.json(response)
            }
        })
    }
    
})


router.post('/upload_records', (req, res) => {
    Record.insertMany(req.body.records, (err, docs) => {
        var response = {}
        response.status = err ?  0 : 1 
        console.log(docs)
        res.json(response)
    })

})

module.exports = router