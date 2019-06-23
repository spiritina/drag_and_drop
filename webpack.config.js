const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
    'bundle': './src/js/index.js',
    'serial': './src/js/serial.js'
},
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
},
    devServer: {
        contentBase: './dist'
    }
};
