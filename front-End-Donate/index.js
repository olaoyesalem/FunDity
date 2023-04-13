import {
    donateFactoryAddress,
    donateAddress,
    donateFactoryABI,
    donateABI,
} from '../front-End-Donate/constant.js'
import { ethers } from './ethers-5.6.esm.min.js'

const connectButton = document.getElementById('connectButton')
connectButton.onclick = connect

const fundButton = document.getElementById('fundButton')
fundButton.onclick = fund

const withdrawButton = document.getElementById('withdrawButton')
withdrawButton.onclick = withdraw

const balanceButton = document.getElementById('balanceButton')
balanceButton.onclick = balance

const createCampaignButton = document.getElementById('campaignButton')
createCampaignButton.onclick = createCampaign

const fundAddressButton = document.getElementById('fundAddressButton')
fundAddressButton.onclick = fundAddress

const withdrawAddressButton = document.getElementById('withdrawAddressButton')
withdrawAddressButton.onclick = withdrawAddresss

const getBalanceButton = document.getElementById('getBalanceButton')
getBalanceButton.onclick = getBalance

const searchButton = document.getElementById('searchButton')
searchButton.onclick = search

function listenForTxnMine(txnResponse, provider) {
    // this is to listen to the blockchain and see events that has happened
    console.log(`Mining ${txnResponse.hash} hash`)

    //create a listner for the blockchain
    return new Promise((resolve, reject) => {
        provider.once(txnResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = 'CONNECTED!!!!!!!'
    } else {
        connectButton.innerHTML = 'Install Metamask !!!!'
    }
}

async function fund() {
    const ethAmount = document.getElementById('ethAmount').value
    console.log(` Funding with ${ethAmount} eth  `)
    console.log(`----------------------------------------`)
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )
        try {
            const txnResponse = await contract.Fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxnMine(txnResponse, provider)
            console.log(
                `Successfully Transferred ${ethAmount} eth from ${signer.address} to ${donateFactoryAddress}`
            )
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
        console.log(` Withdrawing!!!!!!!!!!!`)
        console.log(`-------------------------------------`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`Signer:${signer.toString()}`)
        const contract = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )
        const owner = contract.getOwner()
        console.log(`owner: ${owner}`)
        const txnResponse = await contract.withdraw()

        await listenForTxnMine(txnResponse, provider)
        console.log(`-------------------------------------`)
        console.log(`Withdrawn........`)
    }
}

async function balance() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const balance = await provider.getBalance(donateFactoryAddress)
        console.log(` Balance : ${ethers.utils.formatEther(balance)} eth`)
    }
}

async function createCampaign() {
    // Once this has been created it should go to a new page(index.html in createCampaign folder) and give the right details
    let Address, addressName, description
    const sendValue = ethers.utils.parseEther('0.1')
    addressName = document.getElementById('addressName').value
    description = document.getElementById('description').value
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )
        const txnResponse = await contract.createDonate(
            addressName,
            description,
            { value: sendValue }
        )
        await txnResponse.wait(1)
        Address = await contract.getNameToAddress(addressName)
        console.log(` Suceesfully Created A campaign at ${Address}`)
    }
}

async function fundAddress() {
    const ethAmount = document.getElementById('ethAmount').value
    let Address,
        addressName = document.getElementById('addressName').value

    // the name of the campaign i.e addressName is maaped to the corresponding address
    // the addressName is gotten when the a user clicks any address it wants to fund from the front end,
    // then the name of the campaign a user wants to fund is passed in ass address name

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // this contractFactory is an instance of donateFactory,we get the factory once again here necause we want to get
        // a maaping that gives us the address we want to transfer to : nameToAddress(addressName)
        const contractFactory = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )

        Address = await contractFactory.nameToAddress(addressName) //addressName:
        // the name of the campaign i.e addressName is maaped to the corresponding address
        // the addressName is gotten when the a user clicks any address it wants to fund from the front end,
        // then the name of the campaign a user wants to fund is passed in ass address name

        const contract = new ethers.Contract(Address, donateABI, signer)

        try {
            const txnResponse = await contract.donate({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxnMine(txnResponse, provider)
            console.log(
                `Successfully Transferred ${ethAmount} eth from ${signer} to ${Address}`
            )
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdrawAddresss() {
    let Address,
        addressName = document.getElementById('addressName').value

    if (typeof window.ethereum !== 'undefined') {
        console.log(` Withdrawing!!!!!!!!!!!`)
        console.log(`-------------------------------------`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractFactory = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )

        Address = await contractFactory.nameToAddress(addressName)

        const contract = new ethers.Contract(Address, donateABI, signer)

        const txnResponse = await contract.withdraw()
        await listenForTxnMine(txnResponse, provider)
        console.log(`-------------------------------------`)
        console.log(`Withdrawn........`)
    }
}

async function getBalance() {
    let Address,
        addressName = document.getElementById('addressName').value
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractFactory = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )
        Address = await contractFactory.nameToAddress(addressName)
        const balance = await provider.getBalance(Address)
        console.log(` Balance : ${ethers.utils.formatEther(balance)} eth`)
    }
}

async function search() {
    let creatorDetail
    const input = document.getElementById('search').value
    console.log(input)
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )
        console.log("yes")
        // get names, and traversal through the lits
        const lengthOfNames = await contract.getHashedAddressListLength()
        console.log(`length of names ${lengthOfNames}`)
        const hashedName = await contract.getHashedName(input)
        // const expectedHashedName
        creatorDetail = await contract.searchByName(input) //searchByName is working
        console.log("yes")
        

        for (let i = 0; i < lengthOfNames; i++) {
            console.log("yesssss")
            if ((contract.getHashedAddressList(i)).toString() == hashedName.toString()) {
                console.log("yesssss")
                // get the point of the input in the name array.
                // add name array
                const name = await contract.getNamesArray(i);
                 creatorDetail = await contract.searchByName(name)
                 console.log("yesssss")
                 console.log(creatorDetail);
            }
           
        }


      
        
    }
}
