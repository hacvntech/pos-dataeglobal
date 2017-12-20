// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer, remote } = require('electron');
const { app, Menu, MenuItem } = remote;

angular.module('inspinia').service('electron', function($rootScope){
  var me = this;
  me.ipcRenderer = ipcRenderer;
  me.remote = remote;
  me.app = app;
  me.Menu = Menu;
  me.MenuItem = MenuItem;
  me.template = [
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
          click () { me.ipcRenderer.send('learnMore'); }
        },
        {
          label: 'Check for Updates...',
          click() { me.ipcRenderer.send('checkForUpdates', this); }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    me.template.unshift({
      label: me.app.getName(),
      submenu: [
        {
          label: 'About ' + me.app.getName(),
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
    me.template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  me.menu = me.Menu.buildFromTemplate(me.template);
  me.minimizeWindow = function() {
    me.ipcRenderer.send('minimize-window');
  }
  me.restoreWindow = function() {
    me.ipcRenderer.send('restore-window');
  }
  me.closeWindow = function() {
    me.ipcRenderer.send('close-window');
  }
  me.showMenuWindow = function(e) {
    me.menu.popup(remote.getCurrentWindow());
  }
});