const { override } = require('customize-cra');
const path = require('path');

module.exports = override((config) => {
  config.resolve.fallback = {
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    url: require.resolve('url/') , // Added the url polyfill here
    assert: require.resolve('assert/') // Add assert polyfill here
  };
  return config;
});
