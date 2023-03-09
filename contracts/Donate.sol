// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

error DonateFactory__NameHasBeenTaken();
error DonateFactory__NotOwner();
error DonateFactory__FundBeforeCreatingCampaign();
error DonateFactory__CallFailed();
error Donate__CallFailed();
error Donate__NotOwner();
/// @title Donate factory contract
/// @author Olaoye Salem
/// @notice A factory contract for the main FundMe contract
contract DonateFactory{
    //2,187,755
    //2,198,562
    //2,158,723
    //2,127,848

  address[] public deployedFundraisers;// we keep track of all the fundraisers here.
  mapping(string=>address)public nameToAddress;
  bytes32 [] hashedAddressList;
  mapping(address=>uint256) public addressToAmountFunded;
  address [] public funders;  
  address  i_owner;



    modifier checkDuplicateName(string memory _addressName){
       bytes32 addressName= keccak256(abi.encode(_addressName));
       uint256 length = hashedAddressList.length;
       for(uint256 i=0; i<length;++i){
          if(addressName==hashedAddressList[i]){
              revert DonateFactory__NameHasBeenTaken();
          }
           
       }
        _;
    }
  
    modifier onlyOwner(){
        if(msg.sender!=i_owner){
            revert DonateFactory__NotOwner();
        }
    _;
}

modifier hasFunded(){
    if(addressToAmountFunded[msg.sender]<=0){
        revert DonateFactory__FundBeforeCreatingCampaign();
    }

_;
}

    constructor(){
    i_owner = msg.sender;
}

    ///@notice This function creates Donate by calling constructor of Donate
    ///@param campaignName the firstname of the recipient
    ///@param _description the need for the fundraising
    // users must donate any amount before they can create aa campaign
    function createDonate (string memory campaignName, string memory _description ) hasFunded checkDuplicateName(campaignName) public{
        bytes32 hashedString = keccak256(abi.encode(campaignName));
        hashedAddressList.push(hashedString);

        address newDonate = address(new Donate(campaignName,  _description,msg.sender));
        deployedFundraisers.push(newDonate); 
        nameToAddress[campaignName]=newDonate;

        
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
            if(!callSuccess){
                revert DonateFactory__CallFailed();
            }
          
    }

    function balance() public view returns(uint256){
        uint256 balance = address(this).balance;
        return balance;
    }

}

///@title Fund Me
///@author Olaoye Salem
///@notice A fundraising contract on the blockchain/ similar to GoFundMe
contract Donate{
       bytes32 [] private hashedAddressList;
       mapping (address=>uint256) private donorsAmount;
       address [] private donators;
       address  i_owner;
       


         ///@notice only fundraiser/recipient can perform action

          //EVENTS
    //event for when a contract is created. Shows owner address, contract address and description of fundraiser
    event Contract_Created(address indexed _from, address indexed _contract, string _desription );
    // event for when money is donated. Shows address of donor, fundraiser contract donated to and value donated
    event Funds_Donated(address indexed _from, address indexed _contract, uint _value);
       
    //event for when recipient withdraws money from the fundraiser contract. shows the owner address, contract address and amount withdrawn
    event Fund_Withdrawn(address indexed _from, address indexed _contract, uint _value);

   modifier onlyOwner(){
        if(msg.sender!=i_owner){
            revert Donate__NotOwner();
        }
    _;
}

  string public description;
    //Campaign name of reciepient
    string public campaignName;
    //number of donors in the fundraiser
    

       constructor(string memory campaignName, string memory _description, address _i_owner) public {
        i_owner = _i_owner;
        campaignName = campaignName;
        description = _description;

     
        
     emit Contract_Created(i_owner, address(this), description);
    }


    function donate() public  payable{  
        donators.push(msg.sender); 
        donorsAmount[msg.sender] = msg.value; //keeps track of the amount that each donor contributes;  
     emit Funds_Donated(msg.sender,address(this), msg.value);//sends out event that funds has been donated to this fundraiser contract
    }


    
    ///@notice allows for withdrawing funds from contract
    ///@dev Only reciepient can withdraw funds from this contract
    ///@dev all funds can be remooved anytime
    function withdraw() public onlyOwner {//removed onlyOwner
        //balance stores the amount of money in the contract at this moment
        uint balance = address(this).balance;
      emit Fund_Withdrawn(i_owner,address(this),balance);//sends out event that contract owner/recipient have withdrew some funds
       
          (bool callSuccess, )=payable(msg.sender).call{value: balance}("");
          if(!callSuccess){
              revert Donate__CallFailed();
          }
           
    }

    function getBalance(address _address) public view returns(uint256){
        uint256 balance = address(_address).balance;
        return balance;
    }


   receive() external payable{
        donate();
    }
    fallback()external payable{
        donate();
    }

}
