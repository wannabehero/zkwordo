// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { IVerifier } from "../interfaces/IVerifier.sol";

contract MockVerifier is IVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view override returns (bool) {
        // for testing purposes, we just check that the third pubSignal is even
        return pubSignals[2] % 2 == 0;
    }
}
