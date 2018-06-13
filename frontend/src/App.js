import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3.js";
import todo from "./todo.js";
import Block from "./components/activeBlock/block";
import Header from "./components/header/header";
import InputBar from "./components/inputBar/inputBar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      activeTasks: {},
      completedTasks: {},
      searchResults: {},
      searchTerm: "",
      loading: true,
      status: "clear",
      filter: "active",
    };
  }

  setToLocal = () => {
    localStorage.setItem("toDoState", JSON.stringify(this.state));
  };

  async componentDidMount() {
    window.addEventListener("beforeunload", this.setToLocal);
    const state = JSON.parse(localStorage.getItem("toDoState"));

    const accounts = await web3.eth.getAccounts();
    const activeSize = await todo.methods
      .activeCounter()
      .call({ from: accounts[0] });
    const completedSize = await todo.methods
      .completedCounter()
      .call({ from: accounts[0] });
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
        status: "clear",
        dropdownOpen: false
      });
    } else {
      console.log("Loading from blockchain");
      const size = await todo.methods.getSize().call({ from: accounts[0] });
      const activeTasks = {};
      const completedTasks = {};

      for (let i = 0; i < size; i++) {
        const task = await todo.methods.getTask(i).call({ from: accounts[0] });
        const formattedTask = {
          ID: task[0],
          taskString: task[1],
          taskStatus: task[2]
        };
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
    let size = await todo.methods
      .getSize()
      .call({ from: this.state.accounts[0] });

    const activeTask = {};
    while (this.state.activeTasks[size]) {
      size++;
    }
    activeTask.ID = size;
    activeTask.taskString = currentTask;
    activeTask.taskStatus = "active";

    const prevState = { ...this.state.activeTasks };
    prevState[activeTask.ID] = activeTask;
    const current = currentTask;

    await this.setState({
      activeTasks: prevState,
      filter: "active",
      status: "pending"
    });
    await todo.methods.setTask(current).send({ from: this.state.accounts[0] });
  };

  completeTask = event => {
    const ID = event.target.dataset.complete;
    const node = this.state.activeTasks[ID];
    node.taskStatus = "complete";

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
    const ID = event.target.dataset.remove;
    const prevActiveState = { ...this.state.activeTasks };
    delete prevActiveState[ID];
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

  onSearch = () => {
    const searchTerm = this.state.searchTerm.toLowerCase();
    const searchNodes = {};
    for (let key in this.state.activeTasks) {
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
    for (let key in this.state.completedTasks) {
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
                <InputBar onSubmit={this.onSubmit} />
                <div className="tab-container" />
              </main>
            </div>
          </div>
        ) : (
          <div className="App">
            <Header accounts={this.state.accounts} />
            <main>
              <InputBar filter={this.filter} onSubmit={this.onSubmit} />
              <div className="search-container">
                <input
                  value={this.state.searchTerm}
                  onChange={event =>
                    this.setState({ searchTerm: event.target.value })
                  }
                  placeholder="Which todo can I help you find?"
                  className="search-field"
                />
                <button onClick={this.onSearch} className="small-button">
                  Search
                </button>
              </div>
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
