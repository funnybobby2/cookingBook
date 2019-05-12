const Path = require('path');
const fs = require('fs'); // file system interaction
const webpack = require('webpack');
const rimraf = require('rimraf');
const uglifyJSPlugin = require('uglifyjs-webpack-plugin'); // to minify and obfuscate
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // to clean the output directory with each build
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // replace extractTextPlugin not available with webpack 4
// cache management
const dev = process.env.NODE_ENV === 'dev'; // get the value of the environment variable NODE_ENV

// output folder
const outputDirectory = 'dist';
if (fs.existsSync(outputDirectory)) { // If it exists, remove the content to start fresh
  rimraf.sync(`${outputDirectory}/**`);
} else { // Otherwise, we create it on the fly
  fs.mkdirSync(outputDirectory);
}

const cssLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: !dev
    }
  }
];

if (!dev) {
  cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: loader => [
        require('autoprefixer')({ // to auto-prefix css with -webkit- (for Chrome, Safari, ...), -moz- (for Firefox, Flock, ...), -o- (for Opera) or -ms- ( for Internet Explorer)
          browsers: ['last 2 versions', 'safari > 7', 'ie > 8']
        })
      ]
    }
  });
}

const config = {
  // Entry point
  entry: {
    app: [
      'babel-polyfill', // for async, Object.assign, Array.prototype.includes,...
      './src/client/index.js' // Project entry point
    ],
  },
  watch: dev, // we activate the --watch option only in dev
  // Output files
  output: {
    path: Path.join(__dirname, outputDirectory), // basic path for files (bundles, etc.) to produce during a * build *.
    publicPath: '/', // The public URL associated with this path on the disk, which allows you to adjust URLs generated internally by Webpack. Here, the root of the domain.
    filename: '[name].js' // name of the file that we create as output
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: dev ? 'cheap-eval-source-map' : 'source-map', // to enable the source map to debug it only in dev
  module: { // Syntax Loaders: This is the heart of Webpack: they allow us, since our JS, to declare our dependencies to any * assets * (CSS, images, fonts ...) via the usual mechanisms of `import` /` require `.
    rules: [
      {
        enforce: 'pre', // to force the passage of the linter before babel-loader
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['eslint-loader']
      },
      {
        // all the js out of node_modules and dist passes by babel to make them readable by all the navigators
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: ['react-hot-loader/webpack', 'babel-loader']
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
              sourceMap: true,
            },
          }
        ]
      },
      {
        // fonts management
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        // for all images type png, jpg or gif we go through url loader
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // if an image is less than 8K, we convert it to a base 64
              name: '[name].[hash:7].[ext]'
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev
            }
          }
        ]
      },
      {
        test: /\.mp4$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'video/mp4'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  // for file processing adjustments by Webpack
  plugins: [
    new MiniCssExtractPlugin({}),
    new CleanWebpackPlugin([outputDirectory]),
    new webpack.LoaderOptionsPlugin({
      minimize: !dev,
      debug: dev,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favico.ico'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};

module.exports = config;
