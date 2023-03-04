// This is to store the address that gives the priceFeed for each Blockchain
const {getNamedAccounts} = require("hardhat")
const networkConfig ={
    5:{
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    1:{
        name:"mainnet",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    },
    137:{
        name:"polygon",
        ethUsdPriceFeed:"0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}

const DECIMALS = 8

const INITIAL_ANSWER = 10
const developmentChains =["hardhat", 31337]

const campaignName = "Salem"
const description =  "Peace"
const  recipient ="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
module.exports={
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    campaignName,
    description,
    recipient

}
