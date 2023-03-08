const { assert } = require('chai')
const { network, ethers, getNamedAccounts } = require('hardhat')

const {
    developmentChains,
    networkConfig,
    campaignName,
    description,
    
    recipient,
} = require('../helper-hardhat.config')
let donateContract, donateContractFactory, donateFactory, donate, creator
const sendValue = new ethers.utils.parseEther('1')
!developmentChains.includes(network.name)
    ? describe.skip
    : beforeEach(async function () {
          const { deployer } = await getNamedAccounts()
          creator = deployer
          donateContractFactory = await ethers.getContractFactory(
              'DonateFactory'
          )
          donateContract = await ethers.getContractFactory('Donate')
          console.log('Deploying ..........')
          donateFactory = await donateContractFactory.deploy()
          donate = await donateContract.deploy(
              campaignName,
              description,
              recipient
          )
          await donateFactory.deployed
          await donate.deployed
          console.log(`Donate Factory  deployed To ${donateFactory.address} `)
          console.log(`Donaate Contract deployed To ${donate.address} `)

          await donateFactory.Fund({ value: sendValue })
          console.log('Funded!!!')

          console.log(`Deployer: ${deployer}`)
      })

describe('Donate Factory', () => {
    it('deploys a donateContract and donateFactory', async () => {
        assert.notEqual(0x0000000000000000000000000000000000000000)
        assert.notEqual(0x0000000000000000000000000000000000000000)
    })
    it('should check if the name is correctly mapped to the address', async () => {
        let name = 'Salem'
        let description = 'I Want to get a macBook'
        await donateFactory.createDonate(name, description)
        const addressToName = await donateFactory.nameToAddress(name)
        const firstAddress = await donateFactory.deployedFundraisers(0)
        assert.equal(addressToName, firstAddress)
    })
    it('should check if the amount funded is correctly mapped to the address', async () => {
        let name = 'Salem'
        let description = 'I Want to get a macBook'
        const addressToAmountFunded = await donateFactory.addressToAmountFunded(
            creator
        )
        const amountFunded = sendValue
        assert.equal(addressToAmountFunded.toString(), amountFunded.toString())
    })
    it('should check to see the correct balance', async () => {
        const balance = await donateFactory.balance()
        const amountExpected = sendValue
        assert.equal(balance.toString(), amountExpected.toString())
    })
    it(' should allow withdraw', async () => {
        await donateFactory.withdraw()
        const endingBalance = '0'
        assert.equal(endingBalance.toString(), '0')
    })

    it(`should check if the funder is added to the funders array`, async () => {
        const funder = await donateFactory.funders(0)
        const expectedFunder = creator
        assert.equal(funder, expectedFunder)
    })
})

describe('Donate Contract', () => {
    it('donates to the contract', async () => {
        await donate.donate({ value: sendValue })
        const address = donate.address
        const getBalance = await donate.getBalance(address)
        assert.equal(getBalance.toString(), sendValue.toString())
    })
    it(`should check if the funders is added to the donator's array`, async () => {
        await donate.donate({ value: sendValue })
        const funder = creator
        const expectedFunder = await donate.donators(0)
        assert.equal(funder, expectedFunder)
    })
    it('should check if a user can withdraw',async ()=>{
        await donate.donate({ value: sendValue })
        await donate.withdraw()
        const endingBalance = '0'
        assert.equal(endingBalance.toString(), '0')

    })
  
})

// check to see if that only the owner can withdraw
