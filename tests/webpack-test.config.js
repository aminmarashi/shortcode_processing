var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');

var config = {
    entry: './tests/all.js',
    output: {
        filename: './tests/testBundle.js'
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildExit: "mocha tests/testBundle.js"
        })
    ]
};

module.exports = config;
