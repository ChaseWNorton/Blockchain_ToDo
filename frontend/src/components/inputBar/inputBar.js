import React, { Component } from "react";
import Card from "../dropdown/dropdown"


export default class inputBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTask: ""
    };
  }

  submitHandler = () => {
    this.props.onSubmit(this.state.currentTask);
    this.setState({
      currentTask: ""
    });
  };

  render() {
    return (
      <div className="set-task">
        <Card filter={this.props.filter}/>
        <input
          value={this.state.currentTask}
          onChange={event => this.setState({ currentTask: event.target.value })}
          placeholder="What will you do next?"
          className="input-field"
        />
        <button className="lrg-button" onClick={this.submitHandler}>Add ToDo</button>
      </div>
    );
  }
}
