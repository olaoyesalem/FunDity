const { assert } = require('chai')
const { network, ethers } = require('hardhat')
const { developmentChains, networkConfig } = require('../helper-hardhat.config')

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', function () {
          
          const sendValue = ethers.utils.parseEther('1')
          let  endingFundMeBalance
          beforeEach(async function () {
              const chainId = network.config.chainId
              ethUsdPriceAddress = networkConfig[chainId]["ethUsdPriceAddress"]
              console.log(ethUsdPriceAddress)
              const FundMeContractFactory = await ethers.getContractFactory(
                  "FundMe"
              )
              const FundMe = await FundMeContractFactory.deploy(
                  ethUsdPriceAddress
              )
              await FundMe.deployed
          })
          it(' should allow people to fund', async function () {
              await FundMe.Fund({ value: sendValue })
              console.log('Funded!!!')
          })
          it('should allow people to withdraw', async function () {
              await FundMe.Fund({ value: sendValue })
              await FundMe.withdraw()
              endingFundMeBalance = await ethers.provider.getBalance(
                  FundMe.address
              )
              assert.equal(endingFundMeBalance.toString(), '0')
              console.log('Witdrawn!!!!!!!')
          })
      })
