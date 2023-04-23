export interface ContractMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  properties: {
    [key: string]: string | number;
  };
  attributes: [
    {
      trait_type: string;
      value: string | number;
    },
  ];
}
