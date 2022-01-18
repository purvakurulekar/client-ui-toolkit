import path from "path";
// import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";

const BUILD_DIR = path.resolve(__dirname, "dist/");

export default {
    mode: "production",
    target: ["web", "es2020"],
    // experiments: {
    //     outputModule: true
    // },
    output: {
        path: BUILD_DIR,
        filename: "index.js",
        library: {
            // type: "module"
            type: "umd",
            umdNamedDefine: true,
            // export: "default"
        },
        publicPath: ''
    },
    entry: "./src/index.tsx",
    externals: {
        'react': 'react',
        'react-dom': 'reactDOM'
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            query: {
                                name: 'assets/[name].[ext]'
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            query: {
                                mozjpeg: {
                                    progressive: true,
                                },
                                gifsicle: {
                                    interlaced: true,
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                }
                            }
                        }
                    }]
            }
        ],
    },
    resolve: {
        modules: [
            path.resolve(),
            'node_modules',
            'src/components',
            'src',
            '.'
        ],
        extensions: [".tsx", ".ts", ".js"],
    },
    devtool: "eval-source-map",
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'index.d.ts'
                },
                {
                    from: "package.json"
                }, 
                {
                    from: "README.md"
                }]
        })
    ]
};
