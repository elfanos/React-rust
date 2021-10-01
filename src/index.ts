import * as wasmd from "wasm-rust-dev-server";
import { default as wasbin } from "wasm-rust-dev-server/rust_dev_server_bg.wasm";
const loadApp = () => import("./app").catch((error) => console.log("error"));
const run = async () => {
  // Before loading app start the wasbin initialization
  await wasmd.default(wasbin);
  await loadApp();
};
run();
