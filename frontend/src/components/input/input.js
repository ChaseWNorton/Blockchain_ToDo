import React, { Component } from "react";
import Card from "../card/card";

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTask: "",
      searchTerm: ""
    };
  }

  submitHandler = () => {
    this.props.onSubmit(this.state.currentTask);
    this.setState({
      currentTask: ""
    });
  };

  searchHandler = () => {
    this.props.onSearch(this.state.searchTerm);
    this.setState({
      searchTerm: ""
    });
  };

  render() {
    return (
      <div>
        <div className="set-task">
          <Card isFilter={this.props.isFilter} />
          <input
            value={this.state.currentTask}
            onChange={event =>
              this.setState({ currentTask: event.target.value })
            }
            placeholder="What will you do next?"
            className="input-field"
          />
          <button className="lrg-button" onClick={this.submitHandler}>
            Add ToDo
          </button>
        </div>
        <div className="search-container">
          <input
            value={this.state.searchTerm}
            onChange={event =>
              this.setState({ searchTerm: event.target.value })
            }
            placeholder="Which todo can I help you find?"
            className="search-field"
          />
          <button onClick={this.searchHandler} className="small-button">
            Search
          </button>
        </div>
      </div>
    );
  }
}
