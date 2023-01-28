const { ethers, run, network } = require('hardhat')
const { networkConfig } = require('../helper-hardhat.config')


const DECIMALS = 8
const INITIAL_ANSWER = 200000000000
let ethUsdPriceFeed, args
async function main() {
    const chainId = network.config.chainId
    console.log(`chainId:${chainId}`)
    if (chainId == '31337') {
        const MockV3AggregatorFactory = await ethers.getContractFactory(
            'MockV3Aggregator'
        )
        console.log('Deploying.......')
        const MockV3Aggregator = await MockV3AggregatorFactory.deploy(
            DECIMALS,
            INITIAL_ANSWER
        )
        await MockV3Aggregator.deployed
        console.log(`Deployed!!!!! to ${MockV3Aggregator.address}`)
    } else if (chainId !== '31337') {
   
        args = networkConfig[chainId]
        console.log(args)

        const fundMeFactory = await ethers.getContractFactory('FundMe')
        console.log('Deploying.......')
        const FundMe = await fundMeFactory.deploy(
            '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e'
        )
        await FundMe.deployed
        const FundMeAddress = FundMe.address
        if (process.env.ETHERSCAN_API_KEY) {
        }
        verify(FundMeAddress, args)
        console.log("Verified")
    }
}

console.log('Deployed..')

async function verify(contractAddress, args) {
    console.log('verifying....')

    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified')
        } else {
            console.log(e)
        }
    }
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
