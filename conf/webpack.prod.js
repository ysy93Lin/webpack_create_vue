const common = require("./webpack.common")
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const path = require("path")
const { merge } = require("webpack-merge")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
// 因为 extract-text-webpack-plugin目前不支持webpack4，所以要使用如下命令行安装：
// npm install extract-text-webpack-plugin@next
// const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require("happypack")
const os = require("os")
// 手动创建进程池
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
// const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = merge(common, {
    mode: "production",
    plugins: [
        /* new CopyWebpackPlugin(
            {
                patterns: [
                    { from: path.resolve(__dirname, '../src/static'), to: "static" },
                ],
            }
        ), */
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
            threshold: 5120,
            minRatio: 0.8,
            cache: true,
            deleteOriginalAssets: false
        }),
        // 提取组件的css
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:4].css',
            chunkFilename: 'css/[name].[hash:4].css'
        }),
        // dll相关配置
        /* new DllReferencePlugin({
            // context: __dirname,
            manifest: require("../dist/vendor.manifest.json")
        }), */
        // 文件结构可视化，找出导致体积过大的原因
        new BundleAnalyzerPlugin(),
        // 删除冗余代码
        new UglifyJsPlugin({
            include: /\/src/,
            sourceMap: true,
            parallel: true, // 允许并发
            cache: true,  // 开启缓存
            uglifyOptions: {
                compress: {
                    drop_console: true,  // 删除所有console语句
                    reduce_vars: true  // 把使用多次的静态值自动定义为变量
                },
                output: {
                    comments: false,  // 不保留注释
                    beautify: false  // 使输出的代码尽可能紧凑
                }
            }
        }),// 将loader由单进程转为多进程
        new HappyPack({
            id: "babel",
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        // 2.使用bable,新语法转成es5语法
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            ]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(s?)css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                // 开启缓存将转译结果缓存至文件系统，至少可以将Babel-loader的工作效率提升两倍
                // use: "babel-loader?cacheDirectory=true",
                // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
                loader: "happypack/loader?id=babel",
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "../src")]
            },
        ]
    },
    devtool: "cheap-module-source-map"
})