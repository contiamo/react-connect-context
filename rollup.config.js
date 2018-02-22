const { rollup } = require("rollup")
const babel = require("rollup-plugin-babel")

module.exports = {
  input: "index.js",
  output: {
    format: "es",
    file: "lib/bundle.js"
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
}
