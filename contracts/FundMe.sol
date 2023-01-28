//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";


/**
 @title A contract for crowd funding
 @author Olaoye Salem
 @notice This contract is to demo a sample funding contract
 @dev This implements price feeds as our library
 */
 
contract FundMe{
    using PriceConverter for uint256;

address immutable i_owner;
uint256 constant MINIMUM_USD = 1e1*18;// 1 dollar
address [] public funders; 
mapping(address=>uint256) public addressToAmountFunded;
AggregatorV3Interface public priceFeed;

constructor(address priceFeedAddress){
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
}

modifier onlyOwner(){
    require(msg.sender==i_owner);
    _;
}
modifier sendError(){

require(msg.value.getConversionRate(priceFeed)>=MINIMUM_USD, "Send More Eth");
_;
}

    function Fund() public payable sendError  {
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

        
    function highestFunder() public returns(address){

    }

    receive() external payable{
        Fund();
    }
    fallback()external payable{
        Fund();
    }
    function getPrice() public view returns(uint256){
          (,int256 price,,,)=priceFeed.latestRoundData();
    return uint256(price*1e10);
    }

}

