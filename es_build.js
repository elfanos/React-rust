require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    loader: { ".wasm": "binary" },
    outfile: "public/bundle.js",
  })
  .catch((err) => {
    console.log("error", JSON.stringify({ err }));
    process.stderr.write(err.stderr);
    process.exit(1);
  });
