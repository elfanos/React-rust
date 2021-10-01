import * as React from "react";
import * as wasm from "wasm-rust-dev-server";
import ReactDOM from "react-dom";

const HelloWorld = () => {
  const [counter, setCounter] = React.useState<number>(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter((state) => (state += 1));
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [counter]);
  return <h1>hedd{counter}</h1>;
};

ReactDOM.render(<HelloWorld />, document.getElementById("root"));
