// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./Verifier.sol";

contract ZKWordo is ERC1155, Ownable {
    event GuessedCorrectly(address indexed user, uint256 day);
    event GuessedIncorrectly(address indexed user, uint256 day);

    uint256 private immutable _createdAt;

    uint256 private _guessPrice = 0.01 ether;

    Verifier private _verifier;

    constructor(Verifier verifier_)
        ERC1155("https://api.zkwordo.xyz/api/metadata/token/")
        Ownable()
    {
        _createdAt = block.timestamp;
        _verifier = verifier_;
    }

    function contractURI() public pure returns (string memory) {
        return "https://api.zkwordo.xyz/api/metadata/contract";
    }

    function uri(uint256 id) public view override returns (string memory) {
        return string.concat(super.uri(id), Strings.toString(id));
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
            emit GuessedIncorrectly(_msgSender(), day);
            return false;
        }

        _mint(_msgSender(), day, 1, "");
        emit GuessedCorrectly(_msgSender(), day);

        return true;
    }

    function withdraw(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = to.call{value: balance}("");
        require(success, "ZKWordo: withdraw failed");
    }
}
