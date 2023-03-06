const { assert } = require('chai')
const { network, ethers } = require('hardhat')
const {
    developmentChains,
    networkConfig,
    campaignName,
    description,
    recipient,
} = require('../helper-hardhat.config')

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('Donate', function () {
          const sendValue = ethers.utils.parseEther('1')
          let endingFundMeBalance, Donate
          beforeEach(async function () {
              const donateContractFactory = await ethers.getContractFactory(
                  'DonateFactory'
              )
              const donateContract = await ethers.getContractFactory('Donate')
              console.log('Deploying ..........')
              donateFactory = await donateContractFactory.deploy()
              donateContract = await donateContract.deploy(campaignName,description,recipient);
              await donateFactory.wait(1)
              await donateContract.wait(1)
              await donateFactory.deployed
              await donateContract.deployed.
              console.log(`Deployed To ${donateFactory.address} `)
              console.log(`Deployed To ${donateContract.address} `)
              
          })
        })
//           it.only(' should allow people to fund', async function () {
//               await Donate.Fund({ value: sendValue })
//               console.log('Funded!!!')
//           })
//       })
// it('should only the owner to withdraw', async function () {
//     await Donate.Fund({ value: sendValue })
//     await Donate.withdraw()
//     endingFundMeBalance = await ethers.provider.getBalance(Donate.address)
//     assert.equal(endingFundMeBalance.toString(), '0')
//     console.log('Witdrawn!!!!!!!')
// })

//       it('should check if the address created is correctly mapped', async function () {
//           addressName = 'Salem'
//           await Donate.createMyFunDity(addressName)
//           const addressCreated = await Donate.listOfFunDityAddresses(0)
//           const txnResponse = await Donate.nameToAddress(addressName)
//           assert.equal(addressCreated, txnResponse)
//           console.log(' Address Successfully created !!!')
//       })
//       it('should fund the address created',async function(){
//         addressName = 'Salem'
//           await Donate.createMyFunDity(addressName)
//           const address = await Donate.listOfFunDityAddresses(0)
//          await Donate.fundAddress(address)
//          console.log('Successfully Funded!!!')

//       })
//       it.only('should check the balance of the address',async function(){
//         addressName = 'Salem'
//         await Donate.createMyFunDity(addressName)
//         const address = await Donate.listOfFunDityAddresses(0)
//         const txnResponse = await Donate.getAddressBalance(address)

//         assert.equal(txnResponse.toString(),"0")
//       })
//   })

// remains just the withdrawAddress functitton
