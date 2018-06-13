import React from "react";

const Block = ({ activeTasks, onComplete, removeTask }) => {
  return (
    <div className="active-container">
      {Object.keys(activeTasks).map(taskID => {
        return (
          <div key={taskID} id={taskID} className="active-block">
            {activeTasks[taskID].taskStatus === "active" ? (
              <div
                data-complete={taskID}
                onClick={onComplete}
                className="complete-block"
              />
            ) : null}
            <div className="task-string">
              <h3>{activeTasks[taskID].taskString}</h3>
              <p>{activeTasks[taskID].taskStatus}</p>
            </div>

            {activeTasks[taskID].taskStatus === "active" ? (
              <div
                data-remove={taskID}
                onClick={removeTask}
                className="remove-block"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Block;
