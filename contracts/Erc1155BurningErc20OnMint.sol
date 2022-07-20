// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IErc1155BurningErc20OnMint.sol";

abstract contract Erc1155BurningErc20OnMint is
    ERC1155,
    IErc1155BurningErc20OnMint,
    Ownable
{
    // Token name
    string private _name;
    // Token symbol
    string private _symbol;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory uri
    ) ERC1155(uri) {
        _name = name_;
        _symbol = symbol_;
    }

    address public erc20TokenAddress;

    /**
     * @dev setter for the ERC20 (mintpass) token address which will be burned from upon minting
     */
    function setErc20TokenAddress(address erc20TokenAddress_)
        public
        override
        onlyOwner
    {
        erc20TokenAddress = erc20TokenAddress_;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /*
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155)
        returns (bool)
    {
        return
            interfaceId == type(IErc1155BurningErc20OnMint).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     *   @dev this method hooks into ERC1155's internal transfers mechanism (mint, burn, transfer) - see
     https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#ERC1155-_beforeTokenTransfer-address-address-address-uint256---uint256---bytes-
     * - When from and to are both non-zero, from's amount will be transferred to to.
     * - When from is zero, amount will be minted for to.
     * - When to is zero, from's amount will be burned.
     *   from and to are never both zero.
     *   This function checks that the "to" address has at least a balance of 1, in order for them to qualify for
     *   minting an NFT, and if they do, we burn one token
     *   the above logic only applies to minting, other transfer operations are ignored
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        // Make sure this only runs for _mint()
        if (
            from == address(0) && // Should be False for _transfer and False for _burn
            to != address(0)
        ) // False for _burn so adds some _burn redundancy
        {
            require(
                erc20TokenAddress != address(0),
                "erc20TokenAddress undefined"
            );
            uint256 arraysLength = ids.length;
            uint256 requiredMintPasses;
            uint256 toMintPassBalance = IERC20(erc20TokenAddress).balanceOf(to);
            for (uint256 i = 0; i < arraysLength; i++) {
                requiredMintPasses += amounts[i];
            }
            require(
                toMintPassBalance >= requiredMintPasses,
                "Insufficient ERC20 balance"
            );
            ERC20Burnable(erc20TokenAddress).burnFrom(to, requiredMintPasses);
        }
    }
}
