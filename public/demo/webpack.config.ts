const path = require('path')

export default {
    entry: path.resolve(__dirname, 'src/client/index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist/static'),
        filename: "bundle.js"
    },
    watchOptions: {
        aggregateTimeout: 1000,
        ignored: /node_modules/,
    },
    module: {
        rules: [
            // {
            //     test: /\.[jt]sx?$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'swc-loader',
            //         options: {
            //             jsc: {
            //                 parser: {
            //                     syntax: 'typescript',
            //                     tsx: true,
            //                     decorators: true,
            //                 },
            //                 transform: {
            //                     react: {
            //                         pragma: 'React.createElement',
            //                         pragmaFrag: 'React.Fragment',
            //                         throwIfNamespace: true,
            //                         development: false,
            //                         useBuiltins: false,
            //                     },
            //                 },
            //                 externalHelpers: true,
            //                 target: 'es5',
            //             },
            //             module: {
            //                 type: 'commonjs',
            //             },
            //             sourceMaps: true,
            //             inlineSourcesContent: true,
            //         },
            //     },
            // }
            // {
            //     test: /\.(j|t)sx/,
            //     loader: "babel-loader",
            //     options: {
            //         presets: [
            //             ['@babel/preset-env', {
            //                 "useBuiltIns": "entry",
            //                 "corejs": 2,
            //                 "targets": {
            //                     "chrome": "58",
            //                     "ie": "8"
            //                 }
            //             }],
            //             ['@babel/preset-react', {
            //                 "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
            //                 "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
            //                 "throwIfNamespace": false, // defaults to true
            //                 "runtime": "classic", // defaults to classic
            //             }],
            //             ['@babel/preset-typescript']
            //         ],
            //         plugins: ["@babel/plugin-transform-arrow-functions", "@babel/plugin-transform-react-jsx"]
            //     },
            //     exclude: /node_modules/
            // },
            {
                test: /\.(j|t)sx/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: require.resolve(path.resolve(__dirname, 'tsconfig.dev.json'))
                    },
                },
                exclude: /node_modules/
            },

        ]
    },
    resolve: { extensions: ['.tsx', '.ts', '.js', '.jsx'] },
    devtool: "eval-cheap-module-source-map"
}