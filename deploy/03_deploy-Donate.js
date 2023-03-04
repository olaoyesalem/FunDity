const { network, deployments } = require('hardhat')
const { verify } = require('../utils/verify')
const {
    campaignName,
    description,
    
    developmentChains,
} = require('../helper-hardhat.config')
module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const Donate = await deploy('Donate', {
        from: deployer,
        args: [campaignName, description],
        log: true,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(Donate.address, args)
    }
    log(`Deployer : ${deployer}`)
    log('--------------------------')
}
