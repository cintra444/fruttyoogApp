const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove o cache do Metro
config.resetCache = true;

module.exports = config;
