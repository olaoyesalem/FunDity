// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

// Firstly we wan to fund the contract
// next we want to be able to withdraw just only the owner

//Thirdly, create a campaign
// That inherits the fund, withdraw, and other issues.

contract DonateFactory{
// So, we create addresses here and fund,withdraw function.
  address[] public deployedFundraisers;// we keep track of all the fundraisers here.
  mapping(string=>address)public nameToAddress;
  bytes32 [] hashedAddressList;

    modifier checkDuplicateName(string memory _addressName){
       bytes32 addressName= keccak256(abi.encode(_addressName));
       uint256 length = hashedAddressList.length;
       for(uint256 i=0; i<length;++i){
          
           require(addressName!=hashedAddressList[i]," Name Has Already Been taken");// Just So beautiful
       }
        _;
    }
  
    ///@notice This function creates Donate by calling constructor of Donate
    ///@param campaignName the firstname of the recipient
    ///@param _description the need for the fundraising
    function createDonate (string memory campaignName, string memory _description ) checkDuplicateName(campaignName) public{
        bytes32 hashedString = keccak256(abi.encode(campaignName));
        hashedAddressList.push(hashedString);

        address newDonate = address(new Donate(campaignName,  _description));
        deployedFundraisers.push(newDonate); 
        nameToAddress[campaignName]=newDonate;
    }

address [] public funders;  
mapping(address=>uint256) public addressToAmountFunded;
address  i_owner;

    modifier onlyOwner(){
    require(msg.sender==i_owner);
    _;
}

    constructor(){
    i_owner = msg.sender;
}

   function Fund() public payable  {
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

    function balance() public view returns(uint256){
        uint256 balance = address(this).balance;
        return balance;
    }

}


contract Donate{
       bytes32 [] private hashedAddressList;
       mapping (address=>uint256) private donorsAmount;
       address [] donators;

         ///@notice only fundraiser/recipient can perform action
address  i_owner;

    modifier onlyOwner(){
    require(msg.sender==i_owner);
    _;
}




    string public description;
    //Campaign name of reciepient
    string public campaignName;
    //number of donors in the fundraiser
    

       constructor(string memory campaignName, string memory _description) public {
        i_owner = msg.sender;
        campaignName = campaignName;
     
        description = _description;

     
        
    //    emit Contract_Created(_recipient, address(this), _description);
    }


    function donate() public  payable{  
        donators.push(msg.sender); 
        donorsAmount[msg.sender] = msg.value; //keeps track of the amount that each donor contributes;  
     //   emit Funds_Donated(msg.sender,address(this), msg.value);//sends out event that funds has been donated to this fundraiser contract
    }


    
    ///@notice allows for withdrawing funds from contract
    ///@dev Only reciepient can withdraw funds from this contract
    ///@dev all funds can be remooved anytime
    function withdraw() public onlyOwner{
        //balance stores the amount of money in the contract at this moment
        uint balance = address(this).balance;
        // checks if there is money in the account
        require(
            balance != 0,
            "Contract balance is 0"
        );
        
      //  emit Fund_Withdrawn(recipient,address(this),balance);//sends out event that contract owner/recipient have withdrew some funds
       
        bool sent =payable(msg.sender).send(address(this).balance);
    require(sent, "Failed to send ETH");
    }
}


// I am done with the smart contract for now.
//I'll try connecting it with javascript 
// add events
//is there test for events