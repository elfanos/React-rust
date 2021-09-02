import * as React from "react";
import * as wasm from "wasm-rust-dev-server";
import ReactDOM from "react-dom";

const HelloWorld = () => {
  wasm.greet();
  return <h1> hello world with web assembly</h1>;
};

ReactDOM.render(<HelloWorld />, document.getElementById("root"));
