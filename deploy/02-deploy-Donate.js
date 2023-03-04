const {network}= require("hardhat")
const {verify}= require("../utils/verify")

module.exports = async ({getNamedAccounts,deployments})=>{

    const{log,deploy} = deployments
    const{deployer} = getNamedAccounts()

    const DonateFactory = await deploy("DonateFactory",{
        from:deployer,
        log:true,
        args:[]

    })

    if(!developmentChains.includes(network.name)&&process.env.ETHERSCAN_API_KEY){
        await verify(DonateFactory.address,args )
    }
    log( `Deployer : ${deployer}`);
    log("--------------------------");
};