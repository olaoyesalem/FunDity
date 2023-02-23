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
    connectButton.innerHTML = "INSTALL METAMASK!!!!"
}
}

async function fund(){
    if (typeof window.ethereum != "undefined") {
        
    }
    // How to connect for each person that has created an address
}

