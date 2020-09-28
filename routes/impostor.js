var express = require('express');
var router = express.Router();
var Chance = require('chance');


// GET home page.
router.get('/', function(req, res) {
    var genuine_user = req.session.user 


    var impostor_user = req.session.user 


    if(genuine_user) {
        res.render('impostor', {
            subtitle: 'Prueba ',
            genuine_user: genuine_user,
            impostor_user: impostor_user
        })
    }else{
        res.redirect('/')
    }
    
})
  
module.exports = router