const { resolve } = require('path');
const { writeFileSync } = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
/* const babel = require("@babel/core");

babel.transformFile(resolve(__dirname, "test.js"), {
    minified: false,
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-runtime"]
}, (err, res) => {
    console.log(res);
    writeFileSync(resolve(__dirname, "build", "babel.bundle.js"), res.code);
}) */

const webpack = require('webpack');

const compiler = webpack({
  target: 'web',
  mode: 'production',
  entry: resolve(__dirname, 'src', 'test.js'),
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'test.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            minified: true,
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: {
    // minimize: false
    minimizer: [new TerserPlugin()],
  },
});

function generateStats(result, stat) {
  const { errors, warnings } = stat.toJson('errors-warnings');
  if (errors.length > 0) {
    result.errors.push(...errors);
  }
  if (warnings.length > 0) {
    result.warnings.push(...warnings);
  }
  return result;
}

compiler.run((err, statsOrMultiStats) => {
  if (err) {
    return err;
  }
  if ('stats' in statsOrMultiStats) {
    const result = statsOrMultiStats.stats.reduce(generateStats, {
      errors: [],
      warnings: [],
    });
    return result;
  }
  const result = generateStats({
    errors: [],
    warnings: [],
  }, statsOrMultiStats);

  console.log(result.errors.join());
});
