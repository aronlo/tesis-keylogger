var express = require('express');
var router = express.Router();
var {random_user_assignation} = require('../utils')


// GET home page.
router.get('/', function(req, res) {

    if(req.useragent.isMobile) {
        res.render('mobile')
        return
    }

    var isImposedPassword = random_user_assignation() == 'imposed'
    res.render('signup', {
        isImposedPassword: isImposedPassword,
        password_len :  isImposedPassword ? process.env.IMPOSED_PASS_LENGTH : undefined
    })
})
  
module.exports = router