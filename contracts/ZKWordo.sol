// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Verifier.sol";

import "hardhat/console.sol";

contract ZKWordo is ERC1155, Ownable {
    uint256 private immutable _createdAt;

    uint256 private _guessPrice = 0.001 ether;

    Verifier private _verifier;

    constructor(Verifier verifier_) ERC1155("ZKWordo") Ownable() {
        _createdAt = block.timestamp;
        _verifier = verifier_;
    }

    function guessPrice() external view returns (uint256) {
        return _guessPrice;
    }

    function guess(Verifier.Proof calldata proof) external payable returns (bool) {
        require(msg.value == _guessPrice, "ZKWordo: guess price mismatch");
        uint256 day = (block.timestamp - _createdAt) / 1 days;
        require(balanceOf(_msgSender(), day) == 0, "ZKWordo: already guessed today");

        uint[3] memory input = [day, uint160(_msgSender()), uint160(_msgSender())];

        if (!_verifier.verifyTx(proof, input)) {
            console.log("Not verified");
            return false;
        }

        _mint(_msgSender(), day, 1, "");

        console.log("Verified");

        return true;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function withdraw(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = to.call{value: balance}("");
        require(success, "ZKWordo: withdraw failed");
    }
}
