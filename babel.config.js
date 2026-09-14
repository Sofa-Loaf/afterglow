module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo injects the Reanimated plugin as the LAST plugin in
    // its own list. That is the only order that actually runs last: Babel
    // runs top-level `plugins` BEFORE presets, so listing
    // `react-native-reanimated/plugin` (or `react-native-worklets/plugin`)
    // here would transform too early.
    //
    // Reanimated 4.1.x: `react-native-reanimated/plugin` is a re-export of
    // `react-native-worklets/plugin`. Listing both double-applies the same
    // transform. This Play build uses Reanimated 3 (legacy architecture),
    // which must NOT have `react-native-worklets` installed.
    presets: ['babel-preset-expo'],
  };
};
