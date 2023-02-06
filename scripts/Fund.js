const{ethers, network,}= require("hardhat");
const {networkConfig}= require("../helper-hardhat.config");

async function main(){
    const chainId = network.config.chainId;
    console.log(chainId)
    const args = networkConfig[chainId]["ethUsdPriceFeed"]
    const sendValue=10;
    console.log(args)
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("Deploying.......");
    const FundMe = await fundMeFactory.deploy(args);
    await FundMe.deployed;
    console.log("Stil Deploying.......")
    const Fund = await FundMe.Fund({value: sendValue});
    Fund.wait(1);
    console.log(" Funded ");clear
    

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

