require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('hardhat-deploy');
require("solidity-coverage");
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
    sepolia:{
      url:GOERLI_URL,
      chainId:5,
      accounts:[GOERLI_PRIVATE_KEY]
    }
  },
namedAccounts: {
		deployer: {
			default: 0,
			5:0
		},
		player: {
			default: 1,
		},
	},
  
};
