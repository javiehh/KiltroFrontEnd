const path = require('path');

const withCoverage = process.argv.includes('--coverage');
if (withCoverage) process.env.BABEL_ENV = 'coverage';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    files: [{ pattern: 'test/index.js', watched: false }],
    preprocessors: { 'test/index.js': ['webpack', 'sourcemap'] },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [{ test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' }]
      },
      resolve: { extensions: ['.js', '.jsx'] }
    },

    reporters: withCoverage ? ['spec', 'coverage'] : ['spec'],
    specReporter: { suppressPassed: false, suppressSkipped: true, showSpecTiming: false },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'text' }, { type: 'json-summary' }]
    },

    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] }
    },
    singleRun: true,
    browserNoActivityTimeout: 120000
  });
};
