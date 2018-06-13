import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { accounts: state.accounts };
};

const ConnectedHeader = ( { accounts }) => {
  return (
    <header>
      <h1 style={{ textAlign: "center", fontSize: "24px" }}>
        {accounts
          ? `Welcome ${accounts && accounts[0]}`
          : `Please Wait While We Load Your List`}
      </h1>
    </header>
  );
};

const Header = connect(mapStateToProps)(ConnectedHeader);
export default Header;
