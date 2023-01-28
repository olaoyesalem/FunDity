const { network } = require("hardhat");
const { developmentChains,DECIMALS,INITIAL_ANSWER } = require("../helper-hardhat.config");

module.exports = async({getNamedAccounts, deployments})=>{// on local host
    const{log,deploy}= deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId;

    if(developmentChains==(network.name)){
        log("Local Network detected!!!!....!!!!");
        await deploy("MocksV3Aggregator", {
            contract:"MocksV3Aggregator",
            from:deployer,
            log:true,
            args:[DECIMALS,INITIAL_ANSWER],

        })
            log("Mocks deployed")
            log("------------------------------------------------")
    }
};