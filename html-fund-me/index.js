
import { contractAddress, abi }from"./constants.js"
import  {ethers}  from "./ethers-5.6.esm.min.js"

const connectButton = document.getElementById('connectButton')
connectButton.onclick = connect

const fundButton = document.getElementById('fundButton')
fundButton.onclick = fund

const balanceButton = document.getElementById('balanceButton')
balanceButton.onclick = balance

const addressListButton = document.getElementById('addressListButton')
addressListButton.onclick= addressList

const addressToAmountFundedButton = document.getElementById('addressToAmountFunded') 
addressToAmountFundedButton.onclick = addressToAmountFunded

const withdrawButton = document.getElementById('withdrawButton') 
withdrawButton.onclick = withdraw 


const createCampaignButton = document.getElementById('campaignButton')
createCampaignButton.onclick = createCampaign

const viewBalanceButton = document.getElementById("Balance");
viewBalanceButton.onclick = viewBalance

const fundAddressButton = document.getElementById("fundAddress"); 
fundAddressButton.onclick = fundAddress

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

async function createCampaign(){
    let nameToAddress,addressName
     addressName =document.getElementById("addressName").value
    //const addressName ="Salem"
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer)
        console.log("1")
        const txnResponse = await contract.createMyFunDity(addressName)
        console.log("2")
        await txnResponse.wait(1);
         nameToAddress = await contract.nameToAddress(addressName)
        console.log(` Suceesfully Created A campaign at ${nameToAddress}`)
       
        // check it is not working
}

}

async function addressList(){ // Total Lists of addresses
     
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);
        const listOfFunDityAddresses = await contract.numberOfAddresses
         const length = listOfFunDityAddresses.length;
         console.log(`Length : ${listOfFunDityAddresses}`)
        //const addressName =document.getElementById("addressName").value
        //const nameToAddress = await contract.nameToAddress(addressName)
       // console.log(` ${addressName} Created A campaign at ${nameToAddress}`)
        
 
    }
}


async function viewBalance(){
    let address = document.getElementById("addressBalanceButton").value;
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);
        const txnResponse = await contract.getAddressBalance(address);
        const convertedTxnResponse = ethers.utils.formatEther(txnResponse)
        console.log(` ${address} balance is ${convertedTxnResponse} eth`)
    }
}

async function fundAddress(){
    const ethAmount = document.getElementById('ethAmount').value
    const address = document.getElementById("fundAddressButton").value; 
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);
       
        try {
            const txnResponse = await contract.fundAddress(address,
                {value: ethers.utils.parseEther(ethAmount)})
            await txnResponse.wait(1)
            await listenForTxnMine(txnResponse, provider)
            console.log(
                `Successfully Transferred ${ethAmount} eth from ${signer.address} to ${contractAddress}`
            )
        } catch (error) {
            console.log(error)
        }


      console.log(`Funded!!!!`)
    }
   
    }




// So the createFundity is not really working properly
// I'll check goerli network later today

// LIISTS OF WHAT TO DO
// WithdrawAddress - 


//-- Address,owner i.e msg.sender;
// Withdraw - Done
