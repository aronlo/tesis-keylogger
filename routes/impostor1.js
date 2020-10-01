var express = require('express');
var router = express.Router();
var { lcm, random_user_of_array } = require('../utils')
var { getUserImpostorRecordsCount, getUserIds } = require('../querys');
const User = require('../models/user');


router.get('/', async (req, res) => {
    var genuine_user = req.session.user
    var randomUserId = await getRandomUser()

    User.findById(randomUserId).exec((err, impostor_user) => {
        if (genuine_user && impostor_user) {
            res.render('impostor', {
                subtitle: 'Tarea 2:',
                genuine_user: genuine_user,
                impostor_user: impostor_user
            })
        } else {
            res.redirect('/')
        }
    })
})


router.get('/test', async (req, res) => {
    var temp = await getRandomUser()
    res.send(temp)
})


async function getRandomUser() {

    var userList = []
    var weightList = []

    var userIds = await getUserIds()

    var result = (await getUserImpostorRecordsCount()).results

    userIds.forEach(user => {
        var val = result.find(el => el._id.toString() == user._id.toString())
        userList.push(user._id)
        weightList.push(val ? val.value : 0)
    });

    var lcm_value = lcm(weightList)

    var inverseWeightList = weightList.map(x => {
        if (x == 0) return lcm_value
        return lcm_value / x
    })


    console.log(userList)
    console.log(weightList);
    console.log(lcm_value)
    console.log(inverseWeightList);

    return random_user_of_array(userList, inverseWeightList)
}

module.exports = router