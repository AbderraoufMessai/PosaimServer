"use strict";

import {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  globalShortcut,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { machineIdSync } from "node-machine-id";
import { validateLicense } from "license-key-gen";
import settings from "electron-settings";
import { closeServer, startServer } from "./server";

const isDevelopment = process.env.NODE_ENV !== "production";
let win;

async function validate_license() {
  let response;
  const key = await settings.get("license_key");
  if (key) {
    const machineId = machineIdSync(true);
    const secret_key = process.env.SECRET_KEY || "POSAIM";
    const data = {
      info: { machineId },
      prodCode: secret_key,
      appVersion: "1.0.0",
    };
    try {
      response = await validateLicense(data, key);
      response.key = key;
    } catch (err) {
      response = { key, errorCode: 1007, message: "license not valid" };
    }
  } else {
    response = { key, errorCode: 1008, message: "license not found" };
  }
  return response;
}

async function set_license(license_key) {
  await settings.set("license_key", license_key);
}

async function validate_trial() {
  let response;
  const now = Date.now();
  const finish = await settings.get("trial_finish");
  if (finish) {
    response = { finish, trial: now <= finish };
  } else {
    response = { finish: false, trial: false };
  }
  return response;
}

async function start_trial() {
  const validate = await validate_trial();
  if (!validate.finish) {
    const start = Date.now();
    const month = 1000 * 60 * 60 * 24 * 30;
    const end = start + month; // TODO add 30 days
    await settings.set("trial_finish", end);
    return await validate_trial();
  } else {
    return await validate_trial();
  }
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    resizable: false,
    frame: false,
    width: 600,
    height: 450,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
    },
  });
  // reset settings
  ipcMain.handle("reset", async () => {
    if (isDevelopment) {
      await settings.unset("trial_finish");
      await settings.unset("license_key");
    }
  });

  // license
  ipcMain.handle("set-license", async (event, { license_key }) => {
    await set_license(license_key);
    return await validate_license();
  });
  ipcMain.handle("validate-license", async () => {
    return await validate_license();
  });

  // trial
  ipcMain.handle("validate-trial", async () => {
    return await validate_trial();
  });
  ipcMain.handle("start-trial", async () => {
    return await start_trial();
  });

  // server
  let server = null;
  ipcMain.handle("start-server", async () => {
    const licence = await validate_license();
    const trial = await validate_trial();
    const isActivated = licence.errorCode === 0;
    const isTrial = trial.trial;
    if (isActivated || isTrial) {
      if (!server) {
        app.allowRendererProcessReuse = false;
        const DB = require("./server/models");
        await DB.Database.authenticate()
          .then(async () => {
            await DB.Database.sync()
              .then(async () => {
                server = startServer();
              })
              .catch((err) => {
                console.log("sync", err);
              });
          })
          .catch((err) => {
            console.log("authenticate", err);
          });
      }
      return !!server;
    } else {
      return false;
    }
  });
  ipcMain.handle("close-server", async () => {
    if (server) {
      closeServer(server);
      server = null;
    }
    return !!server;
  });

  // console
  ipcMain.on("open-console", () => {
    win.webContents.openDevTools();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev app if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    await win.loadURL("app://./index.html");
  }
}

// Single window
if (app.requestSingleInstanceLock()) {
  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on("ready", async () => {
    // Install Vue Devtools
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e) {
        console.error("Vue Devtools failed to install:", e.toString());
      }
    }
    await createWindow();
  });

  app.on("activate", async () => {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
  });
} else {
  app.quit();
}

// Inactive refresh
app.on("browser-window-focus", () => {
  globalShortcut.register("CommandOrControl+R", () => {
    // CommandOrControl+R is pressed: Shortcut Disabled
  });
  globalShortcut.register("F5", () => {
    // F5 is pressed: Shortcut Disabled
  });
});
app.on("browser-window-blur", () => {
  globalShortcut.unregister("CommandOrControl+R");
  globalShortcut.unregister("F5");
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS, it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
