const webpack = require("webpack");
const {resolve} = require('path');
const next = require('next')
const TerserPlugin = require('terser-webpack-plugin');

const task = webpack({
    entry: resolve(__dirname, 'test.js'),
    output: {
        filename: "test.js",
        path: resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
    },
    optimization: {
        minimizer: [new TerserPlugin()],
    },    
    externals: {
        bcrypt: 'bcrypt',
        'xml-js': 'xml-js',
        knex: 'knex',
        'node-schedule': 'node-schedule',
        'isomorphic-fetch': 'isomorphic-fetch',
        'node-mailjet': 'node-mailjet',
        feed: 'feed',
        express: 'express',
        jimp: 'jimp',
        qs: 'qs',
        next: 'next',
        'express-session': 'express-session',
        'express-fileupload': 'express-fileupload',
        'express-ua-middleware': 'express-ua-middleware',
        'express-ip': 'express-ip'
    },
    mode: 'production',
    target: 'node'
})

task.run(() => console.log('Finished'))