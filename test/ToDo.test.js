const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let accounts;
let toDoList;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  toDoList = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "3000000" });
});

describe("Todo List", async () => {
  it("deploys a contract", () => {
    assert.ok(toDoList.options.address);
  });

  it("adds a todo item", async () => {
    await toDoList.methods.setTask("hello").send({
      from: accounts[0],
      gas: "3000000"
    });

    const item = await toDoList.methods.getTask(0).call();
    assert.ok(item);
  });

  it("sets the status to active", async () => {
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });
    const item = await toDoList.methods.getTask(0).call();
    assert.equal("active", item[2]);
  });
  //
  it("sets the status to complete", async () => {
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });

    let item = await toDoList.methods.getTask(0).call();
    assert.equal("active", item[2]);

    await toDoList.methods.setComplete(0).send({
      from: accounts[0],
      gas: "3000000"
    });

    item = await toDoList.methods.getTask(0).call();
    assert.equal("complete", item[2]);
  });

  it("sets the status of a task to 'removed'", async () => {
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });
    let item = await toDoList.methods.getTask(0).call();
    assert.equal("active", item[2]);

    await toDoList.methods.removeTask(0).send({
      from: accounts[0],
      gas: "3000000"
    });
    item = await toDoList.methods.getTask(0).call();
    assert.equal("removed", item[2]);
  });

  it("can add the same string ToDo twice", async () => {
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });

    let item = await toDoList.methods.getTask(0).call();
    assert.equal("active", item[2]);
    item = await toDoList.methods.getTask(1).call();
    assert.equal("active", item[2]);
  });

  it("can update the task", async () => {
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });

    let item = await toDoList.methods.getTask(0).call();
    assert.equal("Hello", item[1]);

    await toDoList.methods.updateTask(0, "Bye!").send({
      from: accounts[0],
      gas: "3000000"
    });

    item = await toDoList.methods.getTask(0).call();
    assert.equal("Bye!", item[1]);
  });

  it("can loop through a single user's tasks and retrieve all active and completed task", async () => {
    await toDoList.methods.setTask("Hello").send({
      from: accounts[0],
      gas: "3000000"
    });
    await toDoList.methods.setTask("Bye!").send({
      from: accounts[0],
      gas: "3000000"
    });
    await toDoList.methods.setTask("Eth").send({
      from: accounts[0],
      gas: "3000000"
    });

    const size = await toDoList.methods.getSize().call();
    let completedTasks = [];
    let activeTasks = [];

    for (let i = 0; i < size; i++) {
      const task = await toDoList.methods.getTask(i).call();
      if (task[2] === "completed") completedTasks.push(task);
      if (task[2] === "active") activeTasks.push(task);
    }
    assert.equal(3, activeTasks.length);

    await toDoList.methods.setComplete(0).send({
      from: accounts[0],
      gas: "3000000"
    });

    completedTasks = [];
    activeTasks = [];

    for (let i = 0; i < size; i++) {
      const task = await toDoList.methods.getTask(i).call();
      if (task[2] === "complete") completedTasks.push(task);
      if (task[2] === "active") activeTasks.push(task);
    }

    assert.equal(2, activeTasks.length);
    assert.equal(1, completedTasks.length);
  });
});
