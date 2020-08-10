const {resolve} = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
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
        'express-ip': 'express-ip',
        'connect-session-knex': 'connect-session-knex'
    },
    mode: 'production',
    target: 'node'
}