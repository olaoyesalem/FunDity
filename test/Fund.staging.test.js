const { assert } = require('chai')
const {network, ethers} = require('hardhat')
const {developmentChains, networkConfig} = require('../helper-hardhat.config')


!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', function () {
          const sendValue = ethers.utils.parseEther('1')
          let endingFundMeBalance, FundMe
          beforeEach(async function () {
              const FundMeContractFactory = await ethers.getContractFactory(
                  'FundMe'
              )
              console.log('Deploying ..........')
              FundMe = await FundMeContractFactory.deploy()
              await FundMe.deployed
              console.log(`Deployed To ${FundMe.address} `)
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

          it('should check if the address created is correctly mapped', async function () {
              addressName = 'Salem'
              await FundMe.createMyFunDity(addressName)
              const addressCreated = await FundMe.listOfFunDityAddresses(0)
              const txnResponse = await FundMe.nameToAddress(addressName)
              assert.equal(addressCreated, txnResponse)
              console.log(' Address Successfully created !!!')
          })
          it('should fund the address created',async function(){
            addressName = 'Salem'
              await FundMe.createMyFunDity(addressName)
              const address = await FundMe.listOfFunDityAddresses(0)
             await FundMe.fundAddress(address)
             console.log('Successfully Funded!!!')

              
          })
          it.only('should check the balance of the address',async function(){
            addressName = 'Salem'
            await FundMe.createMyFunDity(addressName)
            const address = await FundMe.listOfFunDityAddresses(0)
            const txnResponse = await FundMe.getAddressBalance(address)

            assert.equal(txnResponse.toString(),"0")
          })
      })

      // remains just the withdrawAddress functitton