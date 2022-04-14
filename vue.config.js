const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    externals: {
      sequelize: "require('sequelize')",
    },
  },
  pluginOptions: {
    electronBuilder: {
      externals: ["sequelize"],
      nodeIntegration: true,
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      enableInSFC: true,
      enableBridge: false,
    },
  },
});
