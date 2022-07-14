//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IErc1155BurningErc20OnMint {
    function setErc20TokenAddress(address erc20TokenAddress_) external;

    /*
    @dev input params: address to mint ERC1155 tokens to, token type id, amount to mint and optional data payload
    */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;
}
