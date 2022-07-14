//to mint the required number of passesSPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../Erc1155BurningErc20OnMint.sol";

/*
    Sample ERC1155 contract
*/

contract TestERC1155 is Erc1155BurningErc20OnMint, ReentrancyGuard {
    // solhint-disable-next-line no-empty-blocks
    constructor() ERC1155("http://localhost") {}

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override nonReentrant {
        _mint(to, id, amount, data);
    }
}
