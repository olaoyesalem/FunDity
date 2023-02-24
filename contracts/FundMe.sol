
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
address [] public listOfFunDityAddresses;
uint256 public numberOfAddresses=listOfFunDityAddresses.length;
mapping (string=>address ) public nameToAddress;
FunDitees[] public funditees;

    address []  public list_of_creators;
    mapping(address=>address) public creatorToAddressCreated;
    mapping(address=>address) public addressCreatedToCreator;
    struct  FunDitees{
    address payable funditeeAddress;
    string  name;
    }
    bytes32 [] private hashedAddressList;
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

   modifier checkDuplicateName(string memory _addressName){
       bytes32 addressName= keccak256(abi.encode(_addressName));
       uint256 length = hashedAddressList.length;
       for(uint256 i=0; i<length;++i){
          
           require(addressName!=hashedAddressList[i]," Name Has Already Been taken");// Just So beautiful
       }
        _;
    }
    modifier checkAddress( address _address){
        uint256 length =listOfFunDityAddresses.length;
        for(uint256 i=0; i<length;){
            unchecked{
                ++i;
            }
            require(_address==listOfFunDityAddresses[i],"Address not in the list");
        }
        _;
    }

    function Fund() public payable  {
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender]+=msg.value;

}
    function withdraw()public onlyOwner {
        for(uint i=0; i<funders.length; i++){
            addressToAmountFunded[funders[i]]=0;
        }
        funders = new address[](0);
        (bool callSuccess, )=payable(msg.sender).call{value: address(this).balance}("");
            require(callSuccess,"call Failed");
    }
    
    

      function createMyFunDity(string memory _addressName) public checkDuplicateName(_addressName)  {
        address caller  = msg.sender;   
        list_of_creators.push(caller);                                             
     bytes32 hashedAddressName = keccak256(abi.encode(_addressName));
     hashedAddressList.push(hashedAddressName);// added  hashed to the array to comapre .

     bytes32 hashedString = keccak256(abi.encode(_addressName, msg.sender,block.timestamp));
     address castedAddress = address(uint160(uint256(hashedString)));
     address payable funditeeAddress = payable(castedAddress);
    funditees.push(FunDitees(funditeeAddress,_addressName));
     listOfFunDityAddresses.push(funditeeAddress);
     nameToAddress[_addressName]=funditeeAddress;
     creatorToAddressCreated[caller]=funditeeAddress;
     addressCreatedToCreator[funditeeAddress]=caller;
    

    }

    function fundAddress(address payable _address) public payable{
           bool sent = _address.send(msg.value);
        require(sent, "Failed to send ETH");// Done
    }

    function withdrawFromAddress( address  payable  _address) public {
        // we need to get the addresses to the creator, which has been mapped, then
        // only the address can call this function
     
    //    address caller =   addressCreatedToCreator[_address];
    //    require(msg.sender==caller, "Wrong Sender");
    //    bool sent =payable(msg.sender).send(1000);
    //     require(sent, "Failed to send ETH");
    uint256 balance = address(_address).balance;
    bool sent =payable(address(this)).send(balance);
    require(sent, "Failed to send ETH");
        
    }

    function getAddressBalance(address _address) public view returns(uint256){
        uint256 balance = address(_address).balance;
        return balance;
    }

    receive() external payable{
        Fund();
    }
    fallback()external payable{
        Fund();
    }


}
//withdraw function is not working