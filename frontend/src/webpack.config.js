module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/\bnode_modules\b/],
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/],
}; 