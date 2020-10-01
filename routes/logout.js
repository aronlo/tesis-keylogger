var express = require('express');
var router = express.Router();
var { sendLogoutEmail } = require('../mailer');

router.get('/', function(req, res) {
    var user = req.session.user
    var sessionIndex = req.session.sessionIndex

    sendLogoutEmail(user.email, user.name, sessionIndex)

    req.session.destroy((err) => {
        if(err) console.log(err)
        
        res.redirect('/')
    })
})

module.exports = router