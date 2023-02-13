import { contractAddress, abi }from"./constants.js"
import  {ethers}  from "./ethers-5.6.esm.min.js"

const connectButton = document.getElementById('connectButton')
connectButton.onclick = connect

const fundButton = document.getElementById('fundButton')
fundButton.onclick = fund

const balanceButton = document.getElementById('balanceButton')
balanceButton.onclick = balance

const blockNumberButton = document.getElementById('blockNumberButton') 
blockNumberButton.onclick = blockNumber

const addressToAmountFundedButton = document.getElementById('addressToAmountFunded') 
addressToAmountFundedButton.onclick = addressToAmountFunded

const withdrawButton = document.getElementById('withdrawButton') 
withdrawButton.onclick = withdraw 


const createCampaignButton = document.getElementById('campaignButton')
createCampaignButton.onclick = createCampaign

const highestFundedButton = document.getElementById('highestFundedButton')
highestFundedButton.onclick = highestFunder


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
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txnResponse = await contract.Fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxnMine(txnResponse, provider)
            console.log(
                `Successfully Transferred ${ethAmount} eth from ${signer.address} to ${contractAddress}`
            )
        } catch (error) {
            console.log(error)
        }
    }
}

async function balance() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const balance = await provider.getBalance(contractAddress)
        console.log(` Balance : ${ ethers.utils.formatEther(balance)} eth`)


    }
}

async function blockNumber() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const blockNumber = await provider.getBalance(contractAddress)
        console.log(` currrent Block Number is ${blockNumber.toString()}`)


    }
}




async function addressToAmountFunded(){
    const address =document.getElementById("address").value
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer)
        const txnResponse = await contract.addressToAmountFunded(address)
        console.log(`${ethers.utils.formatEther(txnResponse)} eth`)
    }
}


async function withdraw(){
    if(typeof window.ethereum !== "undefined"){
        console.log(` Withdrawing!!!!!!!!!!!`)
        console.log(`-------------------------------------`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer)
        const txnResponse = await contract.withdraw();
        await listenForTxnMine(txnResponse,provider);
        console.log(`-------------------------------------`)
        console.log(`Withdrawn........`)
        
    }
    
}

async function nameToAddressCreated(addressName){
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer)
        
        const address= nameToAddressCreated(addressName)
}
}
async function createCampaign(){
    const addressName =document.getElementById("addressName").value
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer)
        const txnResponse = await contract.createMyFunDity(addressName)
        const address =nameToAddressCreated(addressName)
        console.log(` ${addressName} has created a campaign with ${address}`)
  
}
}
async function highestFunder(){
    // not working
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer =  provider.getSigner();
        const balance = await provider.getBalance("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65")
      
        console.log(`Highest Funder : ${balance}`);
        
    }
}