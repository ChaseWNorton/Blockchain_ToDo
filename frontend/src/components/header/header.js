import React from "react";

const Header = ({ accounts }) => {
  return (
    <header>
      <h1 style={{ textAlign: "center", fontSize: "24px" }}>
        {accounts
          ? `Welcome ${accounts[0]}`
          : `Please Wait While We Load Your List`}
      </h1>
    </header>
  );
};

export default Header;
