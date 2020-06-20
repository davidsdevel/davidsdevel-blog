const {resolve} = require("path");

module.exports = {
    entry: resolve(__dirname, "test.js"),
    output: resolve(__dirname, "test.bundle.js")
}