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
import ShortCrypt from "short-crypt";
import { machineIdSync } from "node-machine-id";
import { validateLicense } from "license-key-gen";
import settings from "electron-settings";
import { closeServer, startServer } from "./server";
import { Database } from "./server/models";

const isDevelopment = process.env.NODE_ENV !== "production";

async function decrypt_date(cipher) {
  const sc = new ShortCrypt("SUPERMARKET");
  const d = sc.decryptQRCodeAlphanumeric(cipher);

  let date = null;
  if (d) {
    date = String.fromCharCode(...d);
    date = parseInt(date, 36);
    if (isNaN(date)) {
      date = null;
    } else {
      if (isNaN(new Date(date))) {
        date = null;
      }
    }
  }

  return date;
}

async function verify_key() {
  let response;
  const key = await settings.get("license_key");
  if (key) {
    const exp = key.split("-")[0];

    const now = Date.now();
    const expiration = await decrypt_date(exp);

    if (expiration) {
      if (now > expiration) {
        response = { errorCode: 1006, message: "license has expired" };
      } else {
        const machineId = machineIdSync(true);
        const secret_key = process.env.SECRET_KEY || "SUPERMARKET";
        const serial = key.substring(exp.length + 1);
        const data = {
          info: { machineId },
          prodCode: secret_key,
          appVersion: "1.0.0",
        };
        try {
          response = await validateLicense(data, serial);
          response.expiration = expiration;
          response.key = key;
        } catch (err) {
          response = { key, errorCode: 1007, message: "license not valid" };
        }
      }
    } else {
      response = { key, errorCode: 1008, message: "license not valid" };
    }
  } else {
    response = { key, errorCode: 1009, message: "license not found" };
  }
  return response;
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
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

  if (app.requestSingleInstanceLock()) {
    app.on("second-instance", () => {
      // Someone tried to run a second instance, we should focus our window.
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }
    });
  } else {
    app.quit();
  }

  // license
  ipcMain.handle("verify-license", async () => {
    return await verify_key();
  });
  ipcMain.handle("set-license", async (event, { license_key }) => {
    await settings.set("license_key", license_key);
    return await verify_key();
  });

  // server
  let server = null;
  ipcMain.handle("start-server", async () => {
    const valid = await verify_key();
    if (valid.errorCode === 0) {
      if (!server) {
        app.allowRendererProcessReuse = false;
        await Database.sync()
          .then(() => {
            server = startServer();
          })
          .catch((err) => {
            console.log(err);
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

// active refresh
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

app.on("activate", async () => {
  // On macOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

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
