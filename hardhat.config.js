require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('hardhat-deploy');
require("solidity-coverage");
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL; 
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY; 
 
 
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
      url:SEPOLIA_URL,
      chainId:11155111,
      accounts:[SEPOLIA_PRIVATE_KEY]
    }
  },
namedAccounts: {
		deployer: {
			default: 0,
			11155111:0
		},
		player: {
			default: 1,
		},
	},
  
};
