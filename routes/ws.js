var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Record = require('../models/record');
var mongoose = require('mongoose');
var { getClientIp } = require('../utils')
var { sendEmail, sendRecoverPassEmail } = require('../mailer');
var { getUserImpostorRecordsCount, getUserImpostorRecordsCountJs } = require('../querys');
var moment = require('moment');
const fs = require('fs');
const path = require('path')

router.get('/time', (req, res) => {
    var currentTime = new Date
    res.json({
        timeToString: currentTime.toString(),
        time: currentTime
    })
})

router.get('/ip', function (req, res) {
    res.json({
        data:  req.useragent,
        ip_1: req.ip,
        ip_2: req.connection.remoteAddress,
        ip_3: getClientIp(req)
    })
})

router.get('/test', async function (req, res) {
    var data = {}
    data.queryMongo = await getUserImpostorRecordsCount()
    data.queryJs =  await getUserImpostorRecordsCountJs()
    res.json(data)
})


router.get('/getcookies', function (req, res) {
    res.json(req.cookies)
})

router.get('/getcookie/:cookie', function (req, res) {
    res.json(req.cookies[req.params.cookie])
})

router.get('/setcookie/:cookie/:value', function (req, res) {
    res.cookie(req.params.cookie, req.params.value)
    res.json({status: 1})
})

router.get('/clearcookie/:cookie', function (req, res) {
    res.clearCookie(req.params.cookie)
    res.json({status: 1})
})


router.get('/status', (req, res) => {
    // 0: disconnected
    // 1: connected
    // 2: connecting
    // 3: disconnecting
    res.json({
        mongo: mongoose.connection.readyState,
        user: req.session.user,
        sessionIndex: sessionIndex
    })
})

router.get('/temp', async (req, res) => {
    var tempdir =  path.join(__dirname, '..', 'temp')
    console.log(tempdir)
    fs.readdir(tempdir,  (err, files) =>  {
        //handling error
        if (err) {
            res.json({ msg: 'Unable to scan directory: ' + err });
        } else {
            res.json({ files : files})
        }
    });
})

router.post('/login', (req, res) => {

    console.log("Inicio de sesión de:")
    console.log("Usuario: " +req.body.username)
    console.log("Contraseña: " +req.body.password)

    User.findOne({
        username: req.body.username,
        password: req.body.password
    })
        .exec((err, userDoc) => {
            var response = {}
            if (userDoc == null) {
                if (req.cookies.token) {
                    var userId = req.cookies.token.split("_")[0]
                    var new_record = new Record({
                        belongedUserId: userId,
                        performedUserId: userId,
                        date: new Date,
                        sessionIndex: -1,
                        valid: false,

                        username: req.body.username,
                        password: req.body.password,
                        rawUsernameKeydown: req.body.rawUsernameKeydown,
                        rawUsernameKeyup: req.body.rawUsernameKeyup,
                        rawPasswordKeydown: req.body.rawPasswordKeydown,
                        rawPasswordKeyup: req.body.rawPasswordKeyup,

                        ipAddress: getClientIp(req),
                        userAgent: req.useragent.browser + "_" + req.useragent.os,
                        token: req.cookies.token
                    })

                    new_record.save((err, doc) => {
                        response.status = 0
                        response.error = "No se encontró ningun usuario con los datos enviados en la base de datos. Revisa tu correo para ver las credenciales."
                        res.json(response)
                    })
                } else {
                    response.status = 0
                    response.error = "No se encontró ningun usuario con los datos enviados en la base de datos. Revisa tu correo para ver las credenciales."
                    res.json(response)
                }
            } else {
                //Check if already exist records
                Record.find({
                    belongedUserId: userDoc._id,
                    performedUserId: userDoc._id,
                    valid: true,
                    date: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    }
                }).exec((err, recordDocs) => {

                    var sessionIndex
                    if (recordDocs.length == 0) {
                        sessionIndex = 0
                    } else if (recordDocs.length < 3) {
                        var lastRecord = recordDocs.slice(-1)[0]
                        sessionIndex = lastRecord.sessionIndex + 1
                    }

                    req.session.sessionIndex = sessionIndex

                    if (recordDocs.length >= 3) {
                        response.status = 0
                        response.error = "Se alcanzó el maximo de intentos permitidos por día."
                        res.json(response)
                    } else {

                        var tempToken = req.cookies.token ? req.cookies.token : userDoc._id + "_" + Date.now()
                        if (!req.cookies.token) res.cookie('token', tempToken)

                        var new_record = new Record({
                            belongedUserId: userDoc._id,
                            performedUserId: userDoc._id,
                            date: new Date,
                            sessionIndex: sessionIndex,
                            valid: true,

                            username: userDoc.username,
                            password: userDoc.password,
                            rawUsernameKeydown: req.body.rawUsernameKeydown,
                            rawUsernameKeyup: req.body.rawUsernameKeyup,
                            rawPasswordKeydown: req.body.rawPasswordKeydown,
                            rawPasswordKeyup: req.body.rawPasswordKeyup,

                            ipAddress: getClientIp(req),
                            userAgent: req.useragent.browser + "_" + req.useragent.os,
                            token: tempToken
                        })

                        new_record.save((err, doc) => {
                            req.session.user = userDoc

                            // This user won't have to log in for a year
                            req.session.cookie.maxAge = 24 * 60 * 60 * 1000;

                            response.status = 1
                            response.data = userDoc
                            res.json(response)
                        })
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
                    dni: req.body.dni,
                    password: req.body.password,
                    isImposedPassword: req.body.isImposedPassword,
                    genre: req.body.genre,
                    handedness: req.body.handedness,
                    handDesease: req.body.handDesease,
                    
                    date: new Date,
                    ipAddress: getClientIp(req),
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
                            doc.name,
                            doc.lastname,
                            doc.dni,
                            doc.username,
                            doc.password)
                    }
                    res.cookie('token', doc._id + "_"+ doc.date.getTime())
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

    var tempToken = req.cookies.token ? req.cookies.token : userDoc._id + "_" + Date.now()
    if (!req.cookies.token) res.cookie('token', tempToken)

    var performedUser = req.session.user
    var payload = req.body
    var records = []

    payload.validRecords.forEach(e => {
        e.belongedUserId = payload.belongedUserId
        e.performedUserId = performedUser._id
        e.date = new Date
        e.sessionIndex = req.session.sessionIndex,
        e.valid = true

        e.username = payload.username
        e.password = payload.password

        e.ipAddress= getClientIp(req)
        e.userAgent =  req.useragent.browser + "_" + req.useragent.os
        e.token = tempToken
        records.push(e)
    })

    payload.invalidRecords.forEach(e => {
        e.belongedUserId = payload.belongedUserId
        e.performedUserId = performedUser._id
        e.date = new Date
        e.sessionIndex = req.session.sessionIndex,
        e.valid = false

        e.username = payload.username
        e.password = payload.password

        e.ipAddress= getClientIp(req)
        e.userAgent =  req.useragent.browser + "_" + req.useragent.os
        e.token = tempToken
        records.push(e)
    })

    var response = {}

    Record.insertMany(records, (err, docs) => {
        if (docs == null) {
            response.status = 0
            response.error = "Error en el mongo server. Contactarse al 959291344."
            res.json(response)
        } else {
            response.status = 1
            response.data = docs
            res.json(response)
        }
    })

})

router.post('/forgotpassword', (req, res) =>  {
    var response = {}
    User.findOne({email : req.body.email}).exec((err, doc) => {
        if(doc == null){
            response.status = 0
            response.error = "No se encontró ningun usuario con el correo proporcionado."
            res.json(response)
        } else {
            sendRecoverPassEmail(doc.email, doc.name, doc.lastname, doc.dni, doc.username, doc.password)
            response.status = 1
            response.msg = "Las creedenciales fueron enviadas a tu correo electrónico."
            res.json(response)
        }
    })
})

module.exports = router