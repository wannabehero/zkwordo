// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IVerifier.sol";

contract ZKWordo is ERC1155, Ownable {
    event GuessedCorrectly(address indexed user, uint256 day);
    event GuessedIncorrectly(address indexed user, uint256 day);

    uint256 private immutable _maxWords;
    uint256 private immutable _createdAt;
    uint256 private _guessPrice = 0.01 ether;

    IVerifier private _verifier;

    constructor(IVerifier verifier_, uint256 maxWords_)
        ERC1155("https://api.zkwordo.xyz/api/metadata/token/")
        Ownable()
    {
        _createdAt = block.timestamp;
        _verifier = verifier_;
        _maxWords = maxWords_;
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

    function createdAt() external view returns (uint256) {
        return _createdAt;
    }

    function day() public view returns (uint256) {
        return (block.timestamp - _createdAt) / 1 days;
    }

    function maxWords() external view returns (uint256) {
        return _maxWords;
    }

    function guess(bytes calldata proof) external payable returns (bool) {
        require(msg.value == _guessPrice, "ZKWordo: guess price mismatch");
        uint256 today = day();
        require(today < _maxWords, "ZKWordo: all words guessed");
        require(balanceOf(_msgSender(), today) == 0, "ZKWordo: already guessed today");

        uint160 nSender = uint160(_msgSender());

        uint[] memory input = new uint[](4);
        input[0] = 32;
        input[1] = nSender;
        input[2] = today;
        input[3] = nSender;

        if (!_verifier.verifyProof(proof, input)) {
            emit GuessedIncorrectly(_msgSender(), today);
            return false;
        }

        _mint(_msgSender(), today, 1, "");
        emit GuessedCorrectly(_msgSender(), today);

        return true;
    }

    function withdraw(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success,) = to.call{value: balance}("");
        require(success, "ZKWordo: withdraw failed");
    }
}
