var express = require('express');
var router = express.Router();
var { lcm, random_user_assignation, random_user_of_array } = require('../utils')
var { getUsersRecordsCount, getUserIds } = require('../querys')

// GET home page.
router.get('/', function(req, res) {
    var genuine_user = req.session.user 

    var impostor_user = req.session.user 

    if(genuine_user) {
        res.render('impostor', {
            subtitle: 'Tarea 2:',
            genuine_user: genuine_user,
            impostor_user: impostor_user
        })
    }else{
        res.redirect('/')
    }
    
})


router.get('/test', async (req, res) => {
    var temp = await getRandomUser()

    var arr = [12 ,15, 10, 75, 7,13]
    var new_arr = arr.filter(el => {
        return  el != 0 
    })
    console.log(new_arr)
    console.log(lcm(new_arr))
    res.send(temp)
})


async function getRandomUser() {
    var users = await getUserIds()
    return users
}

module.exports = router