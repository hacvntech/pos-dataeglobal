// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer, remote } = require('electron');  
const { app, Menu, MenuItem } = remote;
angular.module('inspinia').service('electron', function($rootScope){
  this.ipcRenderer = ipcRenderer;
  this.remote = remote;
  this.app = app;
  this.Menu = Menu;
  this.MenuItem = MenuItem;
  this.template = [
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
          click () { this.ipcRenderer.send('learnMore'); }
        },
        {
          label: 'Check for Updates...',
          click() { this.ipcRenderer.send('checkForUpdates'); }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    this.template.unshift({
      label: this.app.getName(),
      submenu: [
        {
          label: 'About ' + this.app.getName(),
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
    this.template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  this.menu = this.Menu.buildFromTemplate(this.template);
  this.minimizeWindow = function() {
    this.ipcRenderer.send('minimize-window');
  }
  this.restoreWindow = function() {
    this.ipcRenderer.send('restore-window');
  }
  this.closeWindow = function() {
    this.ipcRenderer.send('close-window');
  }
  this.showMenuWindow = function(e) {
    this.menu.popup(remote.getCurrentWindow());
  }
});