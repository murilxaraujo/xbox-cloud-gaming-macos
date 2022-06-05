const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      partition: "persist:infragistics",
    },
    width: 800,
    height: 600,
    icon: __dirname + "assets/favicon.ico",
    titleBarStyle: "hidden",
  });

  win.loadURL("https://www.xbox.com/play");

  let cookies = win.webContents.session.cookies;
  cookies.on("changed", function (event, cookie, cause, removed) {
    if (cookie.session && !removed) {
      let url = `https://${cookie.domain + cookie.path}`;

      console.log("url", url);
      cookies.set(
        {
          url: url,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          expirationDate: new Date().setDate(new Date().getDate() + 14),
        },
        function (err) {
          if (err) {
            log.error("Error trying to persist cookie", err, cookie);
          }
        }
      );
    }
  });

  win.webContents.on("did-finish-load", () => {
    win.setTitle("XBOX Cloud Gaming");
  });
};

app.setName("XBOX Cloud Gaming");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
