//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../Erc721BurningErc20OnMint.sol";

/*
    Sample ERC721 contract
*/

contract TestERC721 is Erc721BurningErc20OnMint, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TestToken", "TTKN") {}

    function mint(address to) public override nonReentrant {
        _mint(to, _tokenIds.current());
        _tokenIds.increment();
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
