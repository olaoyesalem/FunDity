require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_URL = process.env.GOERLI_URL; 
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY; 
 
 
	module.exports={
	defaultNetwork:"hardhat",
  	solidity: {
		compilers: [
			{
				version: "0.8.7",
			},
			{
				version: "0.6.6",
			},
		],
	
  },
  networks:{
//    localHost:{
// 			url:LOCAL_HOST_URL,
// 			chainId:31337,
// 			accounts:[LOCAL_HOST_PRIVATE_KEY]
//     },
    goerli:{
      url:"https://eth-goerli.g.alchemy.com/v2/yBl1GLQbYHqEd6W7zkwDknWKYazYLM5J",
      chainId:5,
      accounts:["0x1ce924de5f8bc4ccd20286da28f5b33a58d7443b659ceb509273d84e15dbf914"]
    }
  }
  
};
