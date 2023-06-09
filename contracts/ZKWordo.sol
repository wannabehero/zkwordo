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
    uint256 private immutable _merkleRoot;
    uint256 private _guessPrice = 0.01 ether;

    /// @dev Can be changed for testing purposes
    uint256 private constant _dayLength = 1 days;

    mapping (uint256 => bool) _nullifiers;

    IVerifier private _verifier;

    constructor(IVerifier verifier_, uint256 maxWords_, uint256 merkleRoot_)
        ERC1155("https://api.zkwordo.xyz/api/metadata/token/")
        Ownable()
    {
        _createdAt = block.timestamp;
        _verifier = verifier_;
        _maxWords = maxWords_;
        _merkleRoot = merkleRoot_;
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
        return (block.timestamp - _createdAt) / _dayLength;
    }

    function nextWordAt() external view returns (uint256) {
        return _createdAt + (day() + 1) * _dayLength;
    }

    function maxWords() external view returns (uint256) {
        return _maxWords;
    }

    function guess(uint256 nullifierHash, bytes calldata proof) external payable returns (bool) {
        require(!_nullifiers[nullifierHash], "ZKWordo: proof was already used");
        require(msg.value == _guessPrice, "ZKWordo: guess price mismatch");
        uint256 today = day();
        require(today < _maxWords, "ZKWordo: all words guessed");
        require(balanceOf(_msgSender(), today) == 0, "ZKWordo: already guessed today");

        uint[] memory input = new uint[](3);
        input[0] = nullifierHash;
        input[1] = _merkleRoot;
        input[2] = today;

        _nullifiers[nullifierHash] = true;

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
