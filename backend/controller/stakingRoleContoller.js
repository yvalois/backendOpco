const StakingRole = require('../models/stakingRole');



const newStakingRole = async (req, res) => {
    try {
        const {wallet, role} = req.body;
        console.log('wallet', wallet);
        const stakingRole = await StakingRole.create({
        wallet,
        role,
        });
    
        res.status(200).json({
        success: true,
        data: stakingRole,
        });
    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
        success: false,
        error: err,
        });
    }
};

const verifyStakingRole = async (req, res) => {
    try {
        const {wallet} = req.body;
  
        const stakingRole = await StakingRole.findOne({
        wallet,
        });
        console.log('stakingRole', stakingRole);
        if (stakingRole) {
        res.status(200).json({
        success: true,
        data: stakingRole,
        });
    } else {
        res.status(200).json({
        success: true,
        data: 'no role',
        });
    }
    } catch (err) {
        console.log('Error ', err);
        res.status(400).json({
        success: false,
        error: err,
        });
    }
}


module.exports = {
    newStakingRole,
    verifyStakingRole
}