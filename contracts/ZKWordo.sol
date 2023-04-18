// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKWordo is ERC1155, Ownable {
    uint256 private immutable _createdAt;

    string[] private _words;
    mapping (address => mapping (uint256 => uint16)) _guesses;

    uint256 private _guessPrice = 0.001 ether;

    constructor(string[] memory words_) ERC1155("ZKWordo") Ownable() {
        _createdAt = block.timestamp;
        _words = words_;
    }

    function guessPrice() external view returns (uint256) {
        return _guessPrice;
    }

    function guess(string calldata word) external payable returns (bool) {
        require(msg.value == _guessPrice, "ZKWordo: guess price mismatch");
        uint256 day = (block.timestamp - _createdAt) / 1 days;
        require(balanceOf(_msgSender(), day) == 0, "ZKWordo: already guessed today");
        require(_guesses[_msgSender()][day] < 3, "ZKWordo: spent all the guesses today");

        require(day < _words.length, "ZKWordo: game over");

        bool isRight = keccak256(abi.encodePacked(_words[day])) == keccak256(abi.encodePacked(word));

        _guesses[_msgSender()][day]++;

        if (isRight) {
            _mint(_msgSender(), day, 1, "");
        }

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
