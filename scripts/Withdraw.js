const { getContractFactory } = require('@nomiclabs/hardhat-ethers/types')
const { network } = require('hardhat')
const { networkConfig } = require('../helper-hardhat.config')

async function main() {
    const chainId = network.config.chainId
    const args = networkConfig[chainId]['ethUsdPriceFeed']
    const fundMeFactory = await getContractFactory('FundMe')
    console.log('Deploying......')
    const FundMe = await fundMeFactory.deploy(args)
    FundMe.wait(1)
    await FundMe.withdraw()
    console.log('Withdrawn!!!!!!')
}
