import  {ethers}  from "../../html-fund-me/ethers-5.6.esm.min.js"
import { abi,contractAddress } from "../../html-fund-me/constants.js"


const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

//const fundButton

async function connect(){
if(typeof window.ethereum != "undefined"){
    try {
        await window.ethereum({method:"eth_requestAccounts"})
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
     addressName
     // The addressName will be mapped to address
     // funds will be sent to him
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);
        const address = await contract.nameToAddress(addressName);
        const fundAddress = await contract.fundAddress(address);
        await fundAddress.wait(1);
        
    }
    // How to connect for each person that has created an address
}

async function withdraw(){
    if (typeof window.ethereum != "undefined") {
        
    }
}