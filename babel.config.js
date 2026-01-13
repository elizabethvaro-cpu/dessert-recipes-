module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Required for expo-router to detect routes at build time (web export too).
    plugins: ['expo-router/babel'],
  };
};

