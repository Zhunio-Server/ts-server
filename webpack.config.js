const nodeExternals = require('webpack-node-externals');
const { resolve }   = require('path');
const merge         = require('webpack-merge');

const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');

const ProgressBarPlugin      = require('progress-bar-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin     = require('webpack-shell-plugin');

const base = {
    entry: resolve(__dirname, 'src', 'app.ts'),

    output: {
        filename: 'app.js',
        path: resolve(__dirname, 'dist'),
    },

    target: 'node',

    devtool: 'source-map',

    stats: 'minimal',

    // Need this when working with express, otherwise the build fails
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
    },

    externals: [nodeExternals()],

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new ProgressBarPlugin()
    ],
};

const production = (env, argv) => {
    return {
        mode: 'production',
        plugins: [
            new DefinePlugin({
                'process.env.DOTENV_PATH': JSON.stringify(resolve(__dirname, 'prod.env'))
            }),
        ]
    }
};

const development = (env, argv) => {
    return {
        mode: 'development',

        watch: true,

        plugins: [
            new DefinePlugin({
                'process.env.DOTENV_PATH': JSON.stringify(resolve(__dirname, 'dev.env'))
            }),
            new HotModuleReplacementPlugin(),
            new WebpackShellPlugin({
                onBuildEnd: ['nodemon dist/app.js']
            })
        ]
    }
};

module.exports = (env, argv) => {
    let config;

    if (argv.mode === 'production')
        config = merge(base, production(env, argv));
    else
        config = merge(base, development(env, argv));

    return config;
};
