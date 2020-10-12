var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function (req, res) {
    if(req.useragent.isMobile) {
        res.render('mobile')
        return
    }

    if (req.session.user) {
        res.redirect('/impostor1')
    } else {
        res.render('genuine')
    }

})

module.exports = router