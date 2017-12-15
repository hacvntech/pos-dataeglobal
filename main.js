const { app, BrowserWindow, Menu, protocol, ipcMain, dialog } = require('electron')
const { autoUpdater } = require("electron-updater");
const path = require('path')
const url = require('url')

//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
const name = app.getName();
const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://dataeglobal.com') }
      },
      {
        label: 'Check for Updates...',
        click() { checkForUpdates(this); }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {type: 'separator'},
      {
        label: 'Preferences...',
        accelerator: 'Command+,',
      },
      // {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    width: 1440,
    height: 900,
    fullscreenable: true
    // fullscreen: true
    // webPreferences: {
    //   nodeIntegration: false
    // }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
    query: { 'version': app.getVersion() }
  }))

  // mainWindow.webContents.executeJavaScript(`
  //   var path = require('path');
  //   module.paths.push(path.resolve('node_modules'));
  //   module.paths.push(path.resolve('../node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
  //   path = undefined;
  // `);

  mainWindow.webContents.openDevTools({detach:true});

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.maximize();
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}
let updater;
autoUpdater.autoDownload = false;

function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text);
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
    else {
      updater.enabled = true
      updater = null
    }
  })
})
autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
  updater = null
})
autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
function checkForUpdates (menuItem, focusedWindow, event) {
  updater = menuItem
  updater.enabled = false
  autoUpdater.checkForUpdates()
}
module.exports.checkForUpdates = checkForUpdates

/* create event emitter from angularjs */
ipcMain.on('minimize-window', (event, arg) => {
  mainWindow.minimize();
  // event.sender.send('asynchronous-reply', 'pong')
})
ipcMain.on('restore-window', (event, arg) => {
  if(mainWindow.isMaximized())
    mainWindow.unmaximize();
  else
    mainWindow.maximize();
})
ipcMain.on('close-window', (event, arg) => {
  mainWindow.close();
})