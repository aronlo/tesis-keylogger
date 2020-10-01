var express = require('express');
var router = express.Router();
var { lcm, random_user_of_array } = require('../utils')
var { getUserImpostorRecordsCount, getUserIds } = require('../querys');
const User = require('../models/user');


router.get('/', async (req, res) => {

    if (!req.session.user) {
        res.redirect('/')
    } else {
        var genuine_user = req.session.user

        var count = await User.countDocuments({ _id: { $ne: genuine_user._id } })
        if(count == 0 ){
            res.redirect('/gratefulness')
            return
        }

        var randomUserId
        do {
            randomUserId = await getRandomUser()
        } while (genuine_user._id == randomUserId)

        User.findById(randomUserId).exec((err, impostor_user) => {
            if (genuine_user && impostor_user) {
                res.render('impostor1', {
                    subtitle: 'Tarea 2:',
                    genuine_user: genuine_user,
                    impostor_user: impostor_user
                })
            } else {
                res.redirect('/')
            }
        })
    }
})

router.get('/test', async (req, res) => {

    var a = await (getUserImpostorRecordsCount())
    res.json(a)

})

async function getRandomUser() {

    var userList = []
    var weightList = []

    var userIds = await getUserIds()

    var result = (await getUserImpostorRecordsCount()).results

    console.log(result)

    userIds.forEach(user => {
        var val = result.find(el => el._id.toString() == user._id.toString())
        console.log(val)
        userList.push(user._id)
        weightList.push(val ? val.value : 0)
    });

    var lcm_value = lcm(weightList)

    var inverseWeightList = weightList.map(x => {
        if (x == 0) return lcm_value
        return lcm_value / x
    })

    return random_user_of_array(userList, inverseWeightList)
}

module.exports = router