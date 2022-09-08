const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const APP_DIR = path.resolve(__dirname, './');
const BUILD_DIR = path.resolve(__dirname, '../superset/static/assets');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    // disable gzip compression for cache files
    // faster when there are millions of small files
    cacheCompression: false,
    presets: ['@babel/preset-env', '@babel/preset-react']
  },
};

const output = {
    filename: "[name].bundle.js",
    path: BUILD_DIR,
    publicPath: '/static/assets/', // necessary for lazy-loaded chunks
};

module.exports = (env, argv) => {
    return {
      entry: {
        app: './src/index.tsx',
      },
      output,
      mode: env.WEBPACK_SERVE ? 'development' : 'production',
      plugins: [
          new Dotenv({
            path: `.env${env ? env.file ? `.${env.file}` : '' : ''}`
          }),
          new ManifestPlugin({
              seed: { app: 'superset' },
              // This enables us to include all relevant files for an entry
              generate: (seed, files, entrypoints) => {

                const entryFiles = {};
                Object.entries(entrypoints).forEach(([entry, chunks]) => {
                  entryFiles[entry] = {
                    css: chunks
                      .filter(x => x.endsWith('.css'))
                      .map(x => path.join(output.publicPath, x)),
                    js: chunks
                      .filter(x => x.endsWith('.js'))
                      .map(x => path.join(output.publicPath, x)),
                  };
                });

                return {
                  ...seed,
                  entrypoints: entryFiles,
                };
              },
          }),
          new CleanWebpackPlugin(),
          new CopyPlugin({
            patterns: [
              { from: 'images', to: 'images' },
            ]
          }),
      ],
//    devtool: 'inline-source-map',
      node: {
        'fs': 'empty'
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
      },
      module: {
          rules: [
              {
                test: /\.tsx?$/,
                use: [
                  babelLoader,
                  'ts-loader',
                ],
                exclude: /node_modules/
              },
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              include: [ new RegExp(`${APP_DIR}/src/libs`) ],
              use: [ babelLoader ]
            },
              {
                  test: /\.s[ac]ss$/i,
                  use : [
                      'style-loader',
                      'css-loader',
                      'sass-loader',
                  ],
              },
              {
                  test: /\.css$/,
                  use: [
                      'style-loader',
                      'css-loader'
                  ]
              },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    dimensions: false
                  }
                }
              ]
            },
              {
                  test: /\.(png|svg|jpg|gif)$/,
                  use: [
                      'file-loader'
                  ]
              },
              {
                  test: /\.(woff|woff2|eot|ttf|otf)$/,
                  use: [
                      "file-loader"
                  ]
              },
          ]
      }
    }
}
