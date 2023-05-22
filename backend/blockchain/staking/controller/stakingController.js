const Staking = require('../model/staking');
const ethers = require('ethers')

var url = process.env.NODE_ENV == 'production'? 'https://bsc-dataseed.binance.org/':'https://data-seed-prebsc-1-s1.binance.org:8545';
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
var AddressContract = process.env.NODE_ENV == 'production'? '0x4427603521d987fE181100768Ba7f11b33906a36':'0xbc314F3b316AC6A3438D484C47a2bd1A98DB0211';
var ABI = require('../../abi/staking.json');
const stakingContract = new ethers.Contract(AddressContract, ABI, customHttpProvider);


const getStakings = async (req, res) => {
    try {
        const stakings = await Staking.find({});
        console.log("staking get")
        return res.status(200).send({status: 'ok', stakings})
    } catch (err) {
        console.log(err)
        return res.status(500).send({status: 'error', err})
    }
}

const addStaking = async (req, res) => {
    try {
        
        const owner = await stakingContract.owner();
        const {poolName, poolId, address} = req.body
        if(owner.toLowerCase() !== address.toLowerCase()){
        const staking = new Staking({
            poolName,
            poolId
        })
        await staking.save();

        const stakings = await Staking.find({});
        console.log("staking add")
        return res.status(200).send({status: 'ok', stakings});
    }else{
        return res.status(500).send({status: 'error', err: 'you are not owner'});
    }
    } catch (err) {
        console.log(err)
        return res.status(500).send({status: 'error', err});
    }
}

const modifyStaking = async (req, res) => {
    try {
        const owner = await stakingContract.owner();
        const {poolName, address} = req.body
        if(owner.toLowerCase() !== address.toLowerCase()){
        const staking = await Staking.findByIdAndUpdate(req.params.id, {poolName});
        console.log("staking modify")
        const stakings = await Staking.find({});
        return res.status(200).send({status: 'ok', stakings});
    }else{
        return res.status(500).send({status: 'error', err: 'you are not owner'});
    }
    } catch (err) {
        console.log(err)
        return res.status(500).send({status: 'error', err});
    }
}

const deleteStaking = async (req, res) => {
    try {
        const owner = await stakingContract.owner();
        const {address} = req.body
        if(owner.toLowerCase() !== address.toLowerCase()){
        const staking = await Staking.findByIdAndDelete(req.params.id);
        console.log("staking delete")
        const stakings = await Staking.find({});
        return res.status(200).send({status: 'ok', stakings});
    }else{
        return res.status(500).send({status: 'error', err: 'you are not owner'});
    }
    } catch (err) {
        console.log(err)
        return res.status(500).send({status: 'error', err});
    }
}

module.exports = {
    getStakings,
    addStaking,
    modifyStaking,
    deleteStaking
}