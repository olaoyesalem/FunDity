//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;


/**
 @title A contract for crowd funding
 @author Olaoye Salem
 @notice This contract is to demo a sample funding contract
 @dev This implements price feeds as our library
 */
 
contract FundMe{

address immutable i_owner;
uint256 constant MINIMUM_USD = 1e10*18;// 1 dollar
address [] public funders; 
address [] public f_funders;
mapping(address=>uint256) public addressToAmountFunded;
mapping(uint256=>address) public amountToAddressFunded;
address [] private listOfFunDityAddresses;
mapping (address=>string) private f_nameToAddress;
FunDitees[] public funditees;

struct  FunDitees{
    address payable funditeeAddress;
    string  name;
}


constructor(){
    i_owner = msg.sender;
}

modifier onlyOwner(){
    require(msg.sender==i_owner);
    _;
}
modifier sendError(){

require(msg.value>=MINIMUM_USD, "Send More Eth");
_;
}

    function Fund() public payable virtual {
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender]+=msg.value;

}
    function withdraw()public onlyOwner{
        for(uint i=0; i<funders.length; i++){
            addressToAmountFunded[funders[i]]=0;
        }
        funders = new address[](0);
        (bool callSuccess, )=payable(msg.sender).call{value: address(this).balance}("");
            require(callSuccess,"call Failed");
    }
    
        
function highestFunder() public view returns(address){ 
    //not done yet
    uint256 max=addressToAmountFunded[funders[0]];
    for(uint256 i = 1; i<funders.length;i++) {
        if(max < addressToAmountFunded[funders[i]]) {
            max = addressToAmountFunded[funders[i]];
        }
  return amountToAddressFunded[max];

}
}

function createMyFunDity(string calldata _addressName) public  returns(address){
        // Want to check if there are no two names 
        // get all the names in the the array list an compare it .-=-. 
      
     bytes32 hashedString = keccak256(abi.encode(_addressName, msg.sender,block.timestamp));
     address castedAddress = address(uint160(uint256(hashedString)));
     address payable funditeeAddress = payable(castedAddress);
     listOfFunDityAddresses.push(funditeeAddress);
     funditees.push(FunDitees(funditeeAddress,_addressName));
     return funditeeAddress;
     // copy an paste the functions but transfer funds to funditeAddress
     // add event for creation of address
    }

    function getAddressBalance(address _address) public view returns(uint256){
        uint256 balance = address(_address).balance;
        return balance;
    }

    function fundAddress(address payable _address, uint256 _amount) payable public  {
    
        uint256 oldBalance = address(this).balance;
        uint256 newBalance=address(this).balance+_amount;
        (bool callSuccess,)=payable(_address).call{value: _amount}("");
        require(callSuccess,"call Failed");
        // add event for funding
        // add mssg.sender to list of cretators
        }

    receive() external payable{
        Fund();
    }
    fallback()external payable{
        Fund();
    }


}


//0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
//1000000000000000000


// funding the address is not working