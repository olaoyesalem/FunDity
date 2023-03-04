const {network}= require("hardhat")
const {verify}= require("../utils/verify")

module.exports = async ({getNamedAccounts,deployments})=>{

    const{log,deploy} = deployments
    const{deployer} = getNamedAccounts()
}