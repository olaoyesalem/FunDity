const { assert, expect } = require('chai')
const { network, ethers, getNamedAccounts } = require('hardhat')

const {
    developmentChains,
    networkConfig,
    campaignName,
    description,
    recipient,
} = require('../helper-hardhat.config')
let donateContract,
    donateContractFactory,
    donateFactory,
    donate,
    deployer,
    name,
    player
const sendValue = new ethers.utils.parseEther('1')
!developmentChains.includes(network.name)
    ? describe.skip
    : beforeEach(async function () {
          deployer = (await getNamedAccounts()).deployer
          console.log(deployer)

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

          console.log(`Deployer: ${deployer}`)
      })
describe('Donate Factory', () => {
    name = 'Salem'
    const description = 'I Want to get a macBook'
    it.only('deploys a donateContract and donateFactory', async () => {
        assert.notEqual(
            0x0000000000000000000000000000000000000000,
            donateFactory.address
        )
        assert.notEqual(
            0x0000000000000000000000000000000000000000,
            donate.address
        )
    })
    // very big test
    it(`should revert  if the you didn't deposit at all`, async () => {
        await expect(donateFactory.createDonate(name, description)).to.be
            .reverted
    })
    it.only(`should revert if they didn't deposit up to 0.01 eth`, async () => {
        await expect(
            donateFactory.createDonate(name, description, {
                value: ethers.utils.parseEther('0.001'),
            })
        ).to.be.reverted
    })
    it.only('should create Campiagn if we deposit 0.01 eth or more ', async () => {
        // not working
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const firstCampaign = await donateFactory.getCreatorList(0)
        assert.notEqual(
            firstCampaign,
            0x0000000000000000000000000000000000000000
        )
    })
    it.only('should check if funder is properly recorded', async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const firstFunder = await donateFactory.getFundersList(0)
        assert.equal(firstFunder, deployer)
    })
    it.only('should check to  the if the Creator detail is righly fixed', async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const creatorDetail = await donateFactory.getCreatorDetails(0)
        const creatorDetail_campaignAddress = creatorDetail.campaignAddress
        const firstCampaign = await donateFactory.getCreatorList(0)

        assert.equal(creatorDetail_campaignAddress, firstCampaign)

        const creatorDetail_campaignName = creatorDetail.campaignName
        assert.equal(creatorDetail_campaignName, name)

        const creatorDetail_creator = creatorDetail.creator
        assert.equal(creatorDetail_creator, deployer)
    })
    it.only(' should if the name is rightly mapped to the right address', async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })

        const nameToAddress = await donateFactory.getNameToAddress(name)
        const expectedAddress = await donateFactory.getCreatorList(0)

        assert.equal(nameToAddress, expectedAddress)
    })

    it.only(`should check if the creator is rightly mapped to the right address`, async () => {
        //creatorToCampaignCreated
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const creatorToAddress =
            await donateFactory.getCreatorToCampaignCreated(deployer)
        const expectedAddress = await donateFactory.getCreatorList(0)
        assert.equal(creatorToAddress, expectedAddress)
    })

    it.only(`should the name of the campaign Address is rightly mapped to creator detail`, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const creatorDetail = await donateFactory.getCreatorDetails(0)

        const nameToCreatorDetail = await donateFactory.nameToCreatorDetail(
            name
        )

        assert.equal(creatorDetail, nameToCreatorDetail.toString())
    })
    //campaignAddressToCreatorDetail
    it.only(`should the address of the campaign  is rightly mapped to creator detail`, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })

        const creatorDetail = await donateFactory.getCreatorDetails(0)
        const expectedAddress = await donateFactory.getCreatorList(0)

        const addressToCreatorDetail =
            await donateFactory.AddressToCreatorDetail(expectedAddress)

        assert.equal(
            creatorDetail.toString(),
            addressToCreatorDetail.toString()
        )
    })

    it.only(`should the creator of the campaign  is rightly mapped to creator detail`, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })

        const creatorDetail = await donateFactory.getCreatorDetails(0)

        const creatorToCreatorDetail =
            await donateFactory.getCreatorToCreatorDetail(deployer)

        assert.equal(
            creatorDetail.toString(),
            creatorToCreatorDetail.toString()
        )
    })
    //getEntranceFee

    it.only(`should check the correct entrance fee of the campaign `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })

        const entranceFee = await donateFactory.getEntranceFee()

        const expectedFee = ethers.utils.parseEther('0.01')

        assert.equal(entranceFee.toString(), expectedFee.toString())
    })

    it.only(`should check  the funders list is updated  `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })

        const firstFunder = await donateFactory.getFundersList(0)

        assert.equal(firstFunder, deployer)
    })
    //function balance() public view returns(uint256)

    it.only(`should check if the right balance is updated list is updated  `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const amountSent = ethers.utils.parseEther('0.1')

        const balance = await donateFactory.balance()
        assert.equal(balance.toString(), amountSent.toString())
    })

    it.only(`should not allow any body to withdraw  `, async () => {
        const accounts = await ethers.getSigners()
        const player = accounts[2]
        const accountConnected = donateFactory.connect(player)
        await accountConnected.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        await expect(accountConnected.withdraw(1000)).to.be.reverted
    })
    it.only(`should  allow only deployer to withdraw and the funders array should be equals to zero `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const txnResponse = await donateFactory.withdraw(10)

        assert.equal(txnResponse.true)
    })

    it.only(`should  check if searchByName returns the right details  `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const byName = await donateFactory.searchByName(name)
        const firstCreatorDetails = await donateFactory.getCreatorDetails(0)
        assert.equal(byName.toString(), firstCreatorDetails.toString())
    })

    it.only(`should  check if searchByAddress returns the right details  `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
        const address = await donateFactory.getCampaignAddress(0)
        const byCampaignAddress= await donateFactory.serachByCampaignAddress(address)
        const firstCreatorDetails = await donateFactory.getCreatorDetails(0)
        assert.equal(byCampaignAddress.toString(), firstCreatorDetails.toString())
    })


    it.only(`should  check if searchByCreator returns the right details  `, async () => {
        await donateFactory.createDonate(name, description, {
            value: ethers.utils.parseEther('0.1'),
        })
       
        const byCreator= await donateFactory.searchByCreator(deployer)
        const firstCreatorDetails = await donateFactory.getCreatorDetails(0)
        assert.equal(byCreator.toString(), firstCreatorDetails.toString())
    })
})

describe('Donate Contract', () => {
    it.only('should emit after donating to the contract', async () => {
        await expect(donate.donate({ value: sendValue })).to.emit(
            donate,
            'Funds_Donated'
        )
        //await expect(doContract_Created
    })
    it.only('donates to the contract', async () => {
        await donate.donate({ value: sendValue })
        const address = donate.address
        const getBalance = await donate.getBalance(address)
        assert.equal(getBalance.toString(), sendValue.toString())
    })
    it.only(`should check if the funders is added to the donator's array`, async () => {
        await donate.donate({ value: sendValue })

        const expectedFunder = await donate.getDonators(0)
        assert.equal(expectedFunder, deployer)
    })

    it.only(`should check if the funders is correctly mapped to the amount funded`, async () => {
        await donate.donate({ value: sendValue })

        const expectedAmount = await donate.getDonorToAmount(deployer)
        assert.equal(expectedAmount.toString(), sendValue.toString())
    })

    it.only('should check if a user can withdraw and the balance is equlas to zero', async () => {
        await donate.donate({ value: sendValue })
        await donate.withdraw(sendValue)
        const endingBalance = await donate.getBalance(donate.address)
        assert.equal(endingBalance.toString(), '0')
    })
    it.only(`should check that not any player can withdraw `, async () => {
        const accounts = await ethers.getSigners()
        const player = await accounts[2]
        const accountConnected = await donate.connect(player)
        await expect(accountConnected.withdraw(sendValue)).to.be.reverted
    })

    it.only(`should  check an event is emitted after withdrawing `, async () => {
        await donate.donate({ value: sendValue })
        await expect(donate.withdraw({ value: sendValue })).to.emit
    })
})

// check to see if that only the owner can withdraw