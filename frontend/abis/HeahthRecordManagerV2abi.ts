export const HealthRecordManagerV2Abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
    ],
    name: "gerUserInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "cid",
            type: "string",
          },
          {
            internalType: "enum HealthRecordManagerV2.UserType",
            name: "userType",
            type: "uint8",
          },
        ],
        internalType: "struct HealthRecordManagerV2.User",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHealthRecord",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "someoneId",
        type: "address",
      },
    ],
    name: "getHealthRecordFor",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "address",
        name: "someone",
        type: "address",
      },
    ],
    name: "grantAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
      {
        internalType: "enum HealthRecordManagerV2.UserType",
        name: "userType",
        type: "uint8",
      },
    ],
    name: "initUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
    ],
    name: "isUser",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "address",
        name: "someone",
        type: "address",
      },
    ],
    name: "revokeAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "string",
        name: "cid",
        type: "string",
      },
    ],
    name: "updateHealthRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
      {
        internalType: "address",
        name: "someoneId",
        type: "address",
      },
      {
        internalType: "string",
        name: "cid",
        type: "string",
      },
    ],
    name: "updateHealthRecordFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
