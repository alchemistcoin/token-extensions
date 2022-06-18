//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IErc721BurningErc20OnMint {
    function setErc20TokenAddress(address erc20TokenAddress_) external;

    function mint(address to)  external returns (uint256);
}
