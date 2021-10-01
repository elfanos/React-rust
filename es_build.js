const http = require("http");
const express = require("express");
const esbuild = require("esbuild");
const path = require("path");
const EventEmitter = require("events");

const serverEmitter = new EventEmitter();
const BUILD_DONE = "BUILD_DONE";
const REBUILD_DONE = "REBUILD_DONE";
const PORT = 3000;

const PUBLIC_DIR_PUBLIC = path.join(__dirname, "public");
const PUBLIC_DIR = path.join(__dirname, "views");

const build = esbuild
  .build({
    entryPoints: ["src/index.ts"],
    sourcemap: "external",
    write: true,
    loader: { ".wasm": "binary" },
    outfile: path.join(PUBLIC_DIR_PUBLIC, "bundle.js"),
    bundle: true,
    // hot reloader, send a event from express whenever serverEmitter has gotten a reBuild from esbuild watch
    banner: {
      js: `
      const source = new EventSource('/events');
      source.addEventListener('message', message => {
        if(window){
          window.location.reload();
        }
      });
      `,
    },
    watch: {
      onRebuild(error, result) {
        serverEmitter.emit(REBUILD_DONE, error);
        if (error) {
          console.error("watch build failed:", error);
        } else {
          console.log("watch build succeeded:", result);
        }
      },
    },
  })
  .then((result) => {});

const app = express();

// need to be able to read all static files in public to get javascript as well
app.use(express.static("public"));

// use event bus to handle event stream between client and express server
app.get("/events", async (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  // on refresh remove previous rebuild listener from emitter
  serverEmitter.removeAllListeners([REBUILD_DONE]);

  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write("retry: 10000\n\n");
  serverEmitter.once(REBUILD_DONE, (error) => {
    if (!error) {
      res.write(`data: reload\n\n`);
    }
  });
});
app.get("*", function (req, res) {
  console.log("hello");
  res.sendFile(path.join(PUBLIC_DIR_PUBLIC, "index.html"));
});

app.listen(PORT, () => {
  console.log("hello? -> port", { PORT });
});
