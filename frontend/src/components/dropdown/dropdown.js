import React, { Component } from "react";

export default class Card extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false
    };
  }

  showMenu = (event) => {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  }

  closeMenu = (event) => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener("click", this.closeMenu);
      });
    }
  }

  render() {
    return (
      <div>
        <button className="lrg-button" onClick={this.showMenu}>Filter</button>

        {this.state.showMenu ? (
          <div
            ref={element => {
              this.dropdownMenu = element;
            }}
          >
            <button data-filterall className="small-button" onClick={this.props.filter}> All </button>
            <button data-filteractive className="small-button" onClick={this.props.filter}> Active </button>
            <button data-filtercomplete className="small-button" onClick={this.props.filter}> Completed </button>
          </div>
        ) : null}
      </div>
    );
  }
}
