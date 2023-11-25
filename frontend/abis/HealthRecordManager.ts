export const HealthRecordManagerAbi = [
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
        internalType: "address",
        name: "pm",
        type: "address",
      },
    ],
    name: "addPayManager",
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
    name: "gerUserType",
    outputs: [
      {
        internalType: "enum HealthRecordManager.UserTypes",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAccessList",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
        internalType: "address",
        name: "healthCareId",
        type: "address",
      },
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
    ],
    name: "initDoctor",
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
        name: "email",
        type: "string",
      },
    ],
    name: "initHealthCI",
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
    ],
    name: "initPatient",
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
        name: "email",
        type: "string",
      },
    ],
    name: "initResearcher",
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
        name: "owner",
        type: "address",
      },
    ],
    name: "isOwner",
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
