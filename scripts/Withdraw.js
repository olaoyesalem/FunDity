const { network, ethers } = require('hardhat')

async function main() {

    console.log('Deploying......')
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("Deploying.......");
    const FundMe = await fundMeFactory.deploy();
    await FundMe.deployed;
    console.log("Stil Deploying.......")
    const Fund = await FundMe.withdraw();
    Fund.wait(1);
    console.log(" Funded ");
    
    console.log('Withdrawn!!!!!!')
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
