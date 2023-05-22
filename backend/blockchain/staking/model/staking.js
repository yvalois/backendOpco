const mongoose = require('mongoose');

const stakingSchema = new mongoose.Schema(
    {
        poolName: {
            type: String,
            required: true,
        },
        poolId:{
            type: String,
            required: true,
        }
    }
)

module.exports = mongoose.model('staking', stakingSchema)