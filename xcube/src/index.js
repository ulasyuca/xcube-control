const { app, BrowserWindow, session } = require('electron');
const { ipcMain } = require('electron/main');
const path = require('path');
var fs = require('fs');

app.commandLine.appendSwitch('ignore-certificate-errors');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// (async function main() {
// 	await app.whenReady()
	
// 	const extensions = new ElectronChromeExtensions();
// 	const browserWindow = new BrowserWindow();
	
// 	extensions.addTab(browserWindow.webContents, browserWindow)
	
// 	browserWindow.loadURL('../extensions/digfbfaphojjndkpccljibejjbppifbc');
// 	session.defaultSession.loadExtension('../extensions/digfbfaphojjndkpccljibejjbppifbc');
// })

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'xcube-control.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on("saveText", (event, txtVal) => {
    // fs.writeFile("c:\\Temporary\\file1.txt", txtVal.toString(), (err) => {
    //   if (!err) { console.log("File Written"); }
    //   else {
    //     console.log(err);
    //   }
    // });

    // fs.writeFileSync('c:\\Temporary\\file1.txt', txtVal);

    // fs.appendFile("c:\\Temporary\\file1.txt", txtVal, (err) => {
    //   if (!err) { console.log("File Written"); }
    //   else {
    //       console.log(err);
    //   }
    // })

    fs.open("c:\\Temporary\file1.txt", "w+", (err, fd) => {
      fs.appendFile(fd, "content");

      fs.close(fd, (err) => {
        console.log(err);
      })
    })
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
  BrowserWindow.addExtension()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
