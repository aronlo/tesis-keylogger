var express = require('express');
var router = express.Router();
var { sendLogoutEmail } = require('../mailer');

router.get('/', function(req, res) {
    var user = req.session.user
    var sessionIndex = req.session.sessionIndex

    if(sessionIndex >= 2 ) sendLogoutEmail(user.email, user.name)

    req.session.destroy((err) => {
        if(err) console.log(err)
        
        res.redirect('/')
    })
})

router.get('/error', function(req, res) {

    req.session.destroy((err) => {
        if(err) console.log(err)
        res.redirect('/')
    })
})

module.exports = router