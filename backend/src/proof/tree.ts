type HashFunc = (left: any, right: any) => any;

export function calculateMerkleRootAndPath({
  hashFunc,
  levels,
  elements,
  element,
}: {
  hashFunc: HashFunc;
  levels: number;
  elements: bigint[];
  element: bigint;
}) {
  if (elements.length > 2 ** levels) {
    throw new Error('Tree is full');
  }

  // layer 0 has the leaves
  const layers = [
    elements.slice(), // layer 0
  ];

  for (let level = 1; level <= levels; level++) {
    layers[level] = [];

    for (let i = 0; i < Math.ceil(layers[level - 1].length / 2); i++) {
      // hashing pairs of elements from the previous layer
      // taking 0,1 and 2,3 and so on
      layers[level][i] = hashFunc(layers[level - 1][i * 2], layers[level - 1][i * 2 + 1]);
    }
  }

  // last layer is the root
  const root = layers[levels][0];

  // alternating elements at every level
  // e.g. example, for the tree [1,2,3,4] and element=2
  // pathElements = [1, hash(3,4)]
  const pathElements: bigint[] = [];

  // 1 means that the element is on the right on this level
  // 0 means that it's on the left
  // for the example above, pathIndices = [1, 0]
  const pathIndices: number[] = [];

  let index = layers[0].findIndex((e) => e === element);
  if (index < 0) {
    throw new Error('Leaf is not in the tree');
  }
  for (let level = 0; level < levels; level++) {
    pathIndices[level] = index % 2;
    pathElements[level] = layers[level][index ^ 1];
    index >>= 1;
  }

  return {
    root,
    pathElements,
    pathIndices,
  };
}
