pragma solidity ^0.4.24;

contract ToDo {
    address[] private userAddresses;
    uint public counter = 0;
    uint public activeCounter = 0;
    uint public completedCounter = 0;

    struct task {
        uint ID;
        string taskString;
        string taskStatus;
    }

    struct user {
        mapping(uint => task) taskList;
    }

    mapping(address => user) account;

    function setTask(string newTask) public returns (bool){
        account[msg.sender].taskList[counter].ID = counter;
        account[msg.sender].taskList[counter].taskString = newTask;
        account[msg.sender].taskList[counter].taskStatus = "active";
        counter = counter + 1;
        activeCounter = activeCounter + 1;
        return true;
    }


    function getTask(uint id) public view returns (uint, string, string){
        return (account[msg.sender].taskList[id].ID, account[msg.sender].taskList[id].taskString, account[msg.sender].taskList[id].taskStatus);
    }

    function getSize() public view returns (uint) {
        return counter;
    }

    function updateTask(uint id, string newTask) public returns (bool){
        account[msg.sender].taskList[id].taskString = newTask;
        return true;
    }

    function setComplete(uint id) public returns (bool){
        account[msg.sender].taskList[id].taskStatus = "complete";
        completedCounter = completedCounter + 1;
        if (activeCounter != 0) {
            activeCounter = activeCounter - 1;
        }
        return true;
    }

    function removeTask(uint id) public returns (bool){
        account[msg.sender].taskList[id].taskStatus = "removed";
        if (activeCounter != 0) {
            activeCounter = activeCounter - 1;
        }
        return true;
    }

    function resetCounters() public {
        counter = 0;
        activeCounter = 0;
        completedCounter = 0;
    }
}