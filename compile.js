const solc = require("solc");
const fs = require("fs");
const path = require("path");

const lotteryPath = path.resolve(__dirname, "contracts", "ToDo.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":ToDo"];
