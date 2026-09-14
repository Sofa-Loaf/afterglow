module.exports = function (api) {
  api.cache(true);
  return {
    // Reanimated 4 plugin must run last. Disable the copies babel-preset-expo
    // would inject so the transform is applied once.
    presets: [['babel-preset-expo', { reanimated: false, worklets: false }]],
    plugins: ['react-native-reanimated/plugin'],
  };
};
