var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('/impostor')
    } else {
        res.render('index')
    }

})

// GET home page.
router.get('/test', function (req, res) {


    res.json({
        ipAddress: req.body.ip_address,
        userAgent: req.useragent.browser + "_" + req.useragent.os
    })

})

module.exports = router