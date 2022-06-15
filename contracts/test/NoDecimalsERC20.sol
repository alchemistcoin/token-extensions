// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @title NoDecimalsERC20
/// @notice This contract is used to deploy ERC20 tokens burnable with a fixed supply and 0 decimals.
contract NoDecimalsERC20 is ERC20, ERC20Burnable {
    constructor(
        string memory name,
        string memory symbol,
        address mintTo,
        uint256 mintAmount
    ) ERC20(name, symbol) {
        _mint(mintTo, mintAmount);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }
}
