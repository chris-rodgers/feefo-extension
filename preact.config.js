const preactCliSvgLoader = require('preact-cli-svg-loader');
 
export default (config, env, helpers) => {
  delete config.entry.polyfills;
  config.output.filename = "[name].js";

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  preactCliSvgLoader(config, helpers);

  if (env.production) {
    config.output.libraryTarget = "umd";
  }
};
