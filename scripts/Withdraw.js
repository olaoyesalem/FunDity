const { network, ethers } = require('hardhat')

async function main() {
    const fundMeFactory = await ethers.getContractFactory('FundMe')
    console.log('Deploying......')
    const FundMe = await fundMeFactory.deploy()
    FundMe.deployed
    FundMe.wait(1)
    await FundMe.withdraw()
    console.log('Withdrawn!!!!!!')
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
