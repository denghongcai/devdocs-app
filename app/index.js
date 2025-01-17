'use strict'
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
const appMenu = require('./menu')

// const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden-inset'
  })

  mainWindow.loadURL(`https://devdocs.io/`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.executeJavaScript(`require('electron').webFrame.setZoomLevelLimits(1, 1)`)
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
  })

  page.on('new-window', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })
}

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu)
  createWindow()
  globalShortcut.register('CommandOrControl+Alt+F', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
