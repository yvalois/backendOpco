const express = require('express')
const router = express.Router()
const {
    getStakings,
    addStaking,
    modifyStaking,
    deleteStaking
} = require('../controller/stakingController');




router.get('/', getStakings);
router.post('/add', addStaking);
router.post('/modify/:id', modifyStaking);
router.post('/delete/:id', deleteStaking);



module.exports = router;