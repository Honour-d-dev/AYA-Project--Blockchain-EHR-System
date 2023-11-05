export const LoginmanagerAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "enum LoginManager.UserTypes",
        name: "usertype",
        type: "uint8",
      },
    ],
    name: "addT1user",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum LoginManager.UserTypes",
        name: "usertype",
        type: "uint8",
      },
    ],
    name: "addT2User",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserType",
    outputs: [
      {
        internalType: "enum LoginManager.UserTypes",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
