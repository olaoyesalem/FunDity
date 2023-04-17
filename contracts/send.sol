//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

contract Send {
function send(address payable _address,uint256 sendValue)public {
    (bool callFailed,) = payable(_address).call{value:sendValue}("");
}
}