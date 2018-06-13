import React, { Component } from 'react';
import "./activeBlock.css"

export default class Block extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div className="active-container">
        {Object.keys(this.props.activeTasks).map(taskID => {
          return (
            <div key={taskID} id={taskID} className="active-block">
              {this.props.activeTasks[taskID].taskStatus === 'active' ? (<div data-complete={taskID}
                onClick={this.props.onComplete}
                className="complete-block"
              >
              </div>): null}
              <div className="task-string"><h3>{this.props.activeTasks[taskID].taskString}</h3><p>{this.props.activeTasks[taskID].taskStatus}</p></div>

              {this.props.activeTasks[taskID].taskStatus === 'active' ? <div data-remove={taskID} onClick={this.props.removeTask} className="remove-block"></div> : null}
            </div>
          );
        })}
      </div>
    )
  }
}
