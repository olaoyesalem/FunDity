
const { network } = require("hardhat");
const { developmentChains,networkConfig } = require("../helper-hardhat.config");
const {verify} = require("../utils/verify");

// console.log("Network name=", network.name);
// console.log("Network chain id=", network.chainId);

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { log, deploy } = deployments;
	const { deployer } = await getNamedAccounts();

    // const network = await ethers.getDefaultProvider().getNetwork();
    // console.log(network.chainId);
    // const chainId = network.chainId;
    const chainId = network.config.chainId;
    console.log(chainId)
   // const ethUsdPriceFeedAddress = networkConfig[chainId][ethUsdPriceFeed];
    let ethUsdPriceFeedAddress

    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");// get the most recent deployments of contracts
        ethUsdPriceFeedAddress = ethUsdAggregator.address; // get the address of the contract
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];   
    }
        args = [ethUsdPriceFeedAddress]
    const FundMe = await deploy("FundMe",{
        from:deployer,
        log:true,
        args:[]
        //waitConfirmations:network.config.blockConfirmation,
    })
        
    if(!developmentChains.includes(network.name)&&process.env.ETHERSCAN_API_KEY){
        await verify(FundMe.address,args )
    }

    log("--------------------------");



};
