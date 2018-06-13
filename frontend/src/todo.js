import web3 from "./web3.js";

const address = `0x533a2d6ceED580f1b74d57F11411a3bD2d006bcE`;
const ABI = [
  {
    constant: true,
    inputs: [],
    name: "completedCounter",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "id", type: "uint256" }],
    name: "getTask",
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "string" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "counter",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newTask", type: "string" }],
    name: "setTask",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "id", type: "uint256" },
      { name: "newTask", type: "string" }
    ],
    name: "updateTask",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "id", type: "uint256" }],
    name: "setComplete",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "id", type: "uint256" }],
    name: "removeTask",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "activeCounter",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getSize",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "resetCounters",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export default new web3.eth.Contract(ABI, address);
