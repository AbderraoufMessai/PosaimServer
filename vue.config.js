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
      builderOptions: {
        appId: "com.posaim.server.app",
        productName: "Posaim Server",
        win: {
          target: ["nsis"],
          icon: "public/icon.ico",
          requestedExecutionLevel: "requireAdministrator",
        },
        mac: {
          target: ["dmg"],
          icon: "public/icon.ico",
        },
        dmg: {
          icon: "public/icon.ico",
        },
        nsis: {
          installerIcon: "public/icon.ico",
          uninstallerIcon: "public/icon.ico",
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
        },
      },
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      enableInSFC: true,
      enableBridge: false,
    },
  },
});
