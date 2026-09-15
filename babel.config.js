module.exports = function (api) {
  api.cache(true);
  return {
    // Afterglow does not ship Reanimated. Do not list a worklets/reanimated
    // plugin here: Babel runs top-level `plugins` BEFORE presets, so it would
    // not run last anyway. babel-preset-expo injects the plugin only when the
    // matching package is installed.
    presets: ['babel-preset-expo'],
  };
};
