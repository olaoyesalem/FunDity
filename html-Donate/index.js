// when we create a new campaign a new instance of Donate is sprout out, but different address and the same ABI
// so for every campaign, we need to find a way to autonomously connect the address to the page ....
import {
    donateFactoryAddress,
    donateAddress,
    donateFactoryABI,
    donateABI,
} from '../html-Donate/constant.js'
import { ethers } from './ethers-5.6.esm.min.js'

const connectButton = document.getElementById('connectButton')
connectButton.onclick = connect

const fundButton = document.getElementById('fundButton')
fundButton.onclick = fund

const withdrawButton = document.getElementById('withdrawButton')
withdrawButton.onclick = withdraw

const balanceButton = document.getElementById("balanceButton")
balanceButton.onclick = balance

const createCampaignButton = document.getElementById("campaignButton")
createCampaignButton.onclick = createCampaign


const fundAddressButton = document.getElementById("fundAddressButton")
fundAddressButton.onclick = fundAddress

const withdrawAddressButton = document.getElementById("withdrawAddressButton")
withdrawAddressButton.onclick = withdrawAddresss

const getBalanceButton = document.getElementById("getBalanceButton")
getBalanceButton.onclick = getBalance





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
        const contract = new ethers.Contract(
            donateFactoryAddress,
            donateFactoryABI,
            signer
        )
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
        console.log(` Balance : ${ ethers.utils.formatEther(balance)} eth`)

    }
}


async function createCampaign(){
    // Once this has been created it should go to a new page(index.html in createCampaign folder) and give the right details
    let Address,addressName,description
     addressName =document.getElementById("addressName").value
     description = document.getElementById("description").value
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(donateFactoryAddress,donateFactoryABI,signer)
        const txnResponse = await contract.createDonate(addressName,description)
        await txnResponse.wait(1);
         Address = await contract.nameToAddress(addressName)
        console.log(` Suceesfully Created A campaign at ${Address}`)
       
}
    
}

async function fundAddress(){
    const ethAmount = document.getElementById('ethAmount').value
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        const contract = new ethers.Contract(
            //"0x75537828f2ce51be7289709686A69CbFDbB714F1",
        "0x75537828f2ce51be7289709686A69CbFDbB714F1", // To check if the donateFunction is work
            donateABI,
            signer
        )
        try {
            const txnResponse = await contract.donate({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxnMine(txnResponse, provider)
            console.log(
                `Successfully Transferred ${ethAmount} eth from ${signer.address} to ${"0xE451980132E65465d0a498c53f0b5227326Dd73F"}`
            )
        } catch (error) {
            console.log(error)
        }

    }
}


async function withdrawAddresss(){


    if (typeof window.ethereum !== 'undefined') {
        console.log(` Withdrawing!!!!!!!!!!!`)
        console.log(`-------------------------------------`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            // "0x75537828f2ce51be7289709686A69CbFDbB714F1",
            "0x75537828f2ce51be7289709686A69CbFDbB714F1",
            donateABI,
            signer
        )
        const txnResponse = await contract.withdraw()
        await listenForTxnMine(txnResponse, provider)
        console.log(`-------------------------------------`)
        console.log(`Withdrawn........`)
    }


}


async function getBalance(){

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const balance = await provider.getBalance("0x75537828f2ce51be7289709686A69CbFDbB714F1")
        console.log(` Balance : ${ ethers.utils.formatEther(balance)} eth`)

    }

}