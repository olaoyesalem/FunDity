// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

error DonateFactory__NameHasBeenTaken();
error DonateFactory__NotOwner();
error DonateFactory__NotEnoughEth();
error DonateFactory__FundBeforeCreatingCampaign();
error DonateFactory__CallFailed();
error Donate__CallFailed();
error Donate__NotOwner();
/// @title Donate factory contract
/// @author Olaoye Salem
/// @notice A factory contract for the main FundMe contract
contract DonateFactory{


  address[] private creatorList;
  uint256 immutable private entryFee=10**16;
    address [] public funders;  
  address  i_owner;
  bytes32 [] hashedAddressList;
  mapping(string=>address)private nameToAddress;
  mapping(address=>uint256) private addressToAmountFunded;
  mapping(address=>address) private creatorToCampaignCreated;
  mapping (string=> CreatorDetail) private campaignNameToCreatorDetail;
  mapping (address=> CreatorDetail) private campaignAddressToCreatorDetail;
  mapping (address=> CreatorDetail) private creatorToCreatorDetail;

  /* EVENTS */
event campaignCreated(address indexed creator, address indexed campaign);
event withdrawn(address indexed _to, uint256 indexed _amount);

CreatorDetail [] creatorDetail;
  struct CreatorDetail{
      address campaignAddress;
      string campaignName;
      address creator;
      
  }



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


    constructor(){
    i_owner = msg.sender;
}

    ///@notice This function creates Donate by calling constructor of Donate
    ///@param campaignName the firstname of the recipient
    ///@param _description the need for the fundraising
    // users must donate any amount before they can create a campaign
    function createDonate (string memory campaignName, string memory _description )  checkDuplicateName(campaignName)  public payable {
        if(msg.value<entryFee){
            revert DonateFactory__NotEnoughEth();
        }


       funders.push(msg.sender);
        addressToAmountFunded[msg.sender]+=msg.value;
      
        bytes32 hashedString = keccak256(abi.encode(campaignName));
        hashedAddressList.push(hashedString);

        address newDonate = address(new Donate(campaignName,  _description,msg.sender));
        creatorList.push(newDonate); 
        creatorDetail.push(CreatorDetail(newDonate,campaignName,msg.sender));
        nameToAddress[campaignName]=newDonate;
        creatorToCampaignCreated[msg.sender]=newDonate;
        campaignNameToCreatorDetail[campaignName]=CreatorDetail(newDonate,campaignName,msg.sender);
        campaignAddressToCreatorDetail[newDonate]=CreatorDetail(newDonate,campaignName,msg.sender);
        creatorToCreatorDetail[msg.sender]=CreatorDetail(newDonate,campaignName,msg.sender);

        emit campaignCreated(msg.sender,newDonate);
    }

    function withdraw(uint256 _amount)public onlyOwner{
        for(uint i=0; i<funders.length; i++){
            addressToAmountFunded[funders[i]]=0;
        }
        funders = new address[](0);
        (bool callSuccess, )=payable(msg.sender).call{value: _amount}("");
            if(!callSuccess){
                revert DonateFactory__CallFailed();
            }
          emit withdrawn(msg.sender, _amount);
    }

    function search(address _creator, address _campaignAddress, string memory _campaignName) public{
        // not working
        bool isCreator = (_creator!=address(0));
        bool isCampaignAddress = (_campaignAddress!=address(0));
       
       if(isCreator){
           getCreatorToCreatorDetail(_creator);   
       }
       if(isCampaignAddress){
           AddressToCreatorDetail(_campaignAddress);

       }
      
    }


    function balance() public view returns(uint256){
        uint256 _balance = address(this).balance;
        return _balance;
    }

    function getCampaignAddress(uint256 _index) public view returns(address){
        return creatorList[_index];

    }
    function getCreatorDetails(uint256 _index) public view returns(CreatorDetail memory){
        return creatorDetail[_index];
    }
    function getNameToAddress(string calldata campaignName) public view returns(address){
        return nameToAddress[campaignName];
    }
    function getAddressToAmountFunded(address _address) public view returns(uint256){
        return addressToAmountFunded[_address];
    }
    function getCreatorToCampaignCreated(address _address) public view returns(address){
        return creatorToCampaignCreated[_address];
    }
  
    function nameToCreatorDetail(string memory _name) public view returns(CreatorDetail memory){
        return campaignNameToCreatorDetail[_name];
    }
    function AddressToCreatorDetail(address _address) public view returns(CreatorDetail memory){
        return campaignAddressToCreatorDetail[_address];
    }

    function getCreatorToCreatorDetail(address _creator) public view returns(CreatorDetail memory){
        return creatorToCreatorDetail[_creator];
    }

    function getEntranceFee() public pure returns(uint256){
        return entryFee;
    }

     receive() external payable{
      
    }
    fallback()external payable{
       
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
    

       constructor(string memory _campaignName, string memory _description, address _i_owner) {
        i_owner = _i_owner;
        campaignName = _campaignName;
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
