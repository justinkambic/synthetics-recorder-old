const { _electron: electron } = require("playwright");
const path = require("path");
const Stream = require("stream");
const concurrently = require("concurrently");
const Synthetics = require("@elastic/synthetics");

require("./test");

const writeStream = new Stream.Writable();

async function performE2E() {
  try {
    await run();
    await test();
  } catch (e) {
    console.error(e);
  }
}

writeStream._write = (chunk, _encoding, next) => {
  const str = Buffer.from(chunk).toString("utf-8");

  // wait for app to finish starting up
  if (str.indexOf("You can now view") != -1) {
    writeStream.end();
    performE2E();
  }

  next();
};

concurrently(["BROWSER=none npm run react:start"], {
  outputStream: writeStream,
})
  .catch(e => console.error(e))
  .then(() => console.log("exited successfully"));

async function init() {
  return await electron.launch({
    args: [path.join(__dirname, "..", "electron", "electron.js")],
  });
}

async function run() {
  const electronApp = await init();
  const window = await electronApp.firstWindow();

  window.on("console", console.log);

  // this will work, because PW has access to electron window
  // const aria =
  //   '[aria-label="Enter a URL in this field as the starting point of a journey"]';

  // await window.type(aria, "elastic.co");
  // await window.press(aria, "Enter");
}

async function test() {
  return Synthetics.run({});
}
