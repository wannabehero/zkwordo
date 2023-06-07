pragma circom 2.0.0;

include "merkleTree.circom";

template ZKWordo(levels) {
    signal input root;
    signal input day;

    signal input word;
    signal input nullifier;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    signal output nullifierHash;

    signal hashedWord;

    // calcualte hashed leaf
    component wordHasher = HashLeftRight();
    wordHasher.left <== word;
    wordHasher.right <== day;
    hashedWord <== wordHasher.hash;

    // calcualte nullifier hash
    component nullHasher = HashLeftRight();
    nullHasher.left <== nullifier;
    nullHasher.right <== hashedWord;
    nullifierHash <== nullHasher.hash;

    component tree = MerkleTreeChecker(levels);
    tree.leaf <== hashedWord;
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }
    tree.root === root;
}

component main {public [root, day]} = ZKWordo(6);
