import React, { Component } from "react";
import "./App.css";
import web3 from "./web3.js";
import todo from "./todo.js";
import Block from "./components/block/block";
import Header from "./components/header/header";
import Input from "./components/input/input";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      activeTasks: {},
      completedTasks: {},
      searchResults: {},
      loading: true,
      status: "clear",
      filter: "active"
    };
  }

  setToLocal = () => {
    localStorage.setItem("toDoState", JSON.stringify(this.state));
  };

  async componentDidMount() {
    //Setup event listener for unload to save the state to localStorage
    window.addEventListener("beforeunload", this.setToLocal);

    //Retrieve localStorage
    const state = JSON.parse(localStorage.getItem("toDoState"));

    //Get accounts from web3
    const accounts = await web3.eth.getAccounts();

    //Get the sizes of active and completed storage on the blockchain
    const activeSize = await todo.methods
      .activeCounter()
      .call({ from: accounts[0] });
    const completedSize = await todo.methods
      .completedCounter()
      .call({ from: accounts[0] });

    //Compare sizes from blockchain to sizes from localStorage
    //If different and status is not pending - load from blockchain
    //If different and status is pending - load once from localStorage
    //If not different - load from localStorage

    if (
      (state &&
        Number(activeSize) === Object.keys(state.activeTasks).length &&
        Number(completedSize) === Object.keys(state.completedTasks).length &&
        accounts[0] === state.accounts[0]) ||
      (state &&
        (Number(activeSize) !== Object.keys(state.activeTasks).length ||
          Number(completedSize) !== Object.keys(state.completedTasks).length) &&
        state.status === "pending" &&
        accounts[0] === state.accounts[0])
    ) {
      console.log("Loading from Local Storage");
      await this.setState({
        accounts: state.accounts,
        activeTasks: state.activeTasks,
        completedTasks: state.completedTasks,
        loading: state.loading,
        status: "clear"
      });
    } else {
      console.log("Loading from blockchain");

      //Get next unused ID
      const size = await todo.methods.getSize().call({ from: accounts[0] });

      //Declare storage
      const activeTasks = {};
      const completedTasks = {};

      //Loop through each ID and make a call the blockchain for that task

      for (let i = 0; i < size; i++) {
        const task = await todo.methods.getTask(i).call({ from: accounts[0] });

        //Restructure the data to be easier to read
        const formattedTask = {
          ID: task[0],
          taskString: task[1],
          taskStatus: task[2]
        };

        //Read the status to sort correctly
        if (formattedTask.taskStatus === "complete")
          completedTasks[formattedTask.ID] = formattedTask;
        if (formattedTask.taskStatus === "active")
          activeTasks[formattedTask.ID] = formattedTask;
      }
      await this.setState({
        accounts,
        completedTasks,
        activeTasks,
        loading: false
      });
    }
  }

  onSubmit = async currentTask => {
    //Get next unused ID
    let size = await todo.methods
      .getSize()
      .call({ from: this.state.accounts[0] });

    //Declare storage
    const activeTask = {};

    //Ensure the ID is unused
    //This will typically never run, but is put in place as a fallback
    while (this.state.activeTasks[size]) {
      size++;
    }

    //Declare and assign properties for local state
    activeTask.ID = size;
    activeTask.taskString = currentTask;
    activeTask.taskStatus = "active";

    const prevState = { ...this.state.activeTasks };
    prevState[activeTask.ID] = activeTask;
    const current = currentTask;

    //Set the state and set status to pending.  This will allow someone to refresh the page while the
    //request to the blockchain is still being processed.
    await this.setState({
      activeTasks: prevState,
      filter: "active",
      status: "pending"
    });

    //Set new task
    await todo.methods.setTask(current).send({ from: this.state.accounts[0] });
  };

  completeTask = event => {
    //Get dom node data-complete which is assigned the ID
    const ID = event.target.dataset.complete;

    //Get active node
    const node = this.state.activeTasks[ID];

    //Reassign status to complete
    node.taskStatus = "complete";

    //Update state
    const prevActiveState = { ...this.state.activeTasks };
    const prevCompletedState = { ...this.state.completedTasks };

    delete prevActiveState[ID];

    prevCompletedState[ID] = node;

    this.setState(
      {
        activeTasks: prevActiveState,
        completedTasks: prevCompletedState
      },
      () => {
        todo.methods.setComplete(ID).send({
          from: this.state.accounts[0]
        });
      }
    );
  };

  removeTask = event => {
    //Get ID from dom node data-remove
    const ID = event.target.dataset.remove;

    const prevActiveState = { ...this.state.activeTasks };

    //Delete object prop from local state
    delete prevActiveState[ID];

    //Update State
    //Reassign status on blockchain storage to "removed"
    this.setState(
      {
        activeTasks: prevActiveState,
        filter: "active"
      },
      () => {
        todo.methods.removeTask(ID).send({
          from: this.state.accounts[0]
        });
      }
    );
  };

  filter = event => {
    if (event.target.dataset.filterall) {
      this.setState({
        filter: "all"
      });
    } else if (event.target.dataset.filteractive) {
      this.setState({
        filter: "active"
      });
    } else if (event.target.dataset.filtercomplete) {
      this.setState({
        filter: "complete"
      });
    }
  };

  onSearch = term => {
    const searchTerm = term.toLowerCase();
    const searchNodes = {};

    //Loop through active and completed storage for searchTerm
    //Build up a new storage of found search nodes
    for (let key in this.state.activeTasks) {
      if (this.state.activeTasks.hasOwnProperty(key)) {
        if (
          this.state.activeTasks[key].taskString
            .toLowerCase()
            .indexOf(searchTerm) !== -1
        ) {
          searchNodes[this.state.activeTasks[key].ID] = this.state.activeTasks[
            key
            ];
        }
      }
    }
    for (let key in this.state.completedTasks) {
      if (this.state.completedTasks.hasOwnProperty(key)) {
        if (
          this.state.completedTasks[key].taskString
            .toLowerCase()
            .indexOf(searchTerm) !== -1
        ) {
          searchNodes[
            this.state.completedTasks[key].ID
            ] = this.state.completedTasks[key];
        }
      }
    }
    this.setState({
      filter: "search",
      searchResults: searchNodes,
      searchTerm: ""
    });
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div className="App">
            <div className="App">
              <Header />
              <main>
                <Input />
                <div className="tab-container" />
              </main>
            </div>
          </div>
        ) : (
          <div className="App">
            <Header accounts={this.state.accounts} />
            <main>
              <Input
                isFilter={this.filter}
                onSearch={this.onSearch}
                onSubmit={this.onSubmit}
              />
              <div className="tab-container">
                <Block
                  activeTasks={
                    this.state.filter === "all"
                      ? {
                          ...this.state.activeTasks,
                          ...this.state.completedTasks
                        }
                      : this.state.filter === "active"
                        ? this.state.activeTasks
                        : this.state.filter === "complete"
                          ? this.state.completedTasks
                          : this.state.searchResults
                  }
                  filter={this.state.filter}
                  onComplete={this.completeTask}
                  removeTask={this.removeTask}
                />
              </div>
            </main>
          </div>
        )}
      </div>
    );
  }
}

export default App;
