const express = require('express');
const router = express.Router();
const {newStakingRole, verifyStakingRole} = require('../controller/stakingRoleContoller');

router.post('/new', newStakingRole);
router.post('/verify', verifyStakingRole);

module.exports = router;