const ethers  =require("./ethers-5.6.esm.min.js")
const {contractAddress,abi}= require("./value.js")

async function main(){
    console.log(" Funding------------------")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress,abi,signer)
    const txnResponse = await contract.Fund({value:ethers.utils.parseEther("10")})
    console.log(" Funded!!!!")
    console.log(" ---------------------")

    const balance = provider.getBalance(contractAddress)
    console.log(`Balance : ${ethers.utils.formatEther(balance)}`)
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
