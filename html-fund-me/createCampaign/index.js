import  {ethers}  from "../../html-fund-me/ethers-5.6.esm.min.js"
import { abi,contractAddress } from "../../html-fund-me/constants.js"


const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

const fundButton = document.getElementById("fundButton")
fundButton.onclick = fund


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

async function connect(){
if(typeof window.ethereum != "undefined"){
    try {
        await window.ethereum.request({method:"eth_requestAccounts"})
    } catch (error) {
        console.log(error)
    }
    connectButton.innerHTML = "CONNECTED!!!!"
    
}
else{
    connectButton.innerHTML = "INSTALL  METAMASK!!!"
}
}

async function fund(){
    // get the name from createCampaign and store it in an addressName
     const ethAmount = document.getElementById("ethAmount")
     // The addressName will be mapped to address
     // funds will be sent to him
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);
        const address = await contract.nameToAddress(addressName);
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
        await fundAddress.wait(1);
        
    }
    // How to connect for each person that has created an address
}

async function withdraw(){
    if (typeof window.ethereum != "undefined") {
        
    }
}