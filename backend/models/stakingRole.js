const mongoose = require('mongoose');

const stakingRoleSchema = new mongoose.Schema({
    wallet: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StakingRole', stakingRoleSchema);