// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer, remote} = require('electron');  
const { app, Menu, MenuItem } = remote;

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
const menu = Menu.buildFromTemplate(template);
document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#minimizeWindow').addEventListener('click', () => {
		ipcRenderer.send('minimize-window');
	});
	document.querySelector('#restoreWindow').addEventListener('click', () => {
		ipcRenderer.send('restore-window');
	});
	document.querySelector('#closeWindow').addEventListener('click', () => {
		ipcRenderer.send('close-window');
	});
	document.querySelector('#showMenuWindow').addEventListener('click', () => {
		menu.popup(remote.getCurrentWindow());
	});
});