

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect


fundButton = document.getElementById("fundButton")
fundButton.onclick = fund

async function connect(){
    if(typeof window.ethereum !== "undefined"){
        try {
            await window.ethereum.request({method: "eth_requestAccounts"})
        } catch (error) {
            console.log(error);
        }
      connectButton.innerHTML = "CONNECTED!!!!!!!"
    }else{
        connectButton.innerHTML = "Install Metamask !!!!"
    }

}

async function fund(){

    if(typeof window.ethereum !=="undefined"){
        const provider = new ethers.Providers.web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(abi,);
    }

}