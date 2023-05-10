// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract tokenERC20 is ERC20, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    uint256 private _decimal = 10 ** uint256(decimals());
    uint256 public mintableAmount = 1000000000; // 1 billion

    constructor() ERC20("tokenERC20", "Crypted") {}

    function mint(
        address to,
        uint256 amount
    ) external onlyOwner returns (bool) {
        require(amount <= mintableAmount, "ERC20: Amount is more than allowed");
        mintableAmount = mintableAmount.sub(amount);
        require(_safeMint(to, amount.mul(_decimal)), "ERC20: Minting failed");
        return true;
    }

    function _safeMint(
        address _to,
        uint256 _amount
    ) private nonReentrant returns (bool) {
        _mint(_to, _amount);
        return true;
    }
}
