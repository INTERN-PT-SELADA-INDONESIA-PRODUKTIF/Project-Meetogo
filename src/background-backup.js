// import {app, BrowserWindow} from 'electron'

// function createBrowser(){
//     const win = new BrowserWindow({
//         width:800,
//         height:800,
//         webPreferences: {
//             nodeIntegration : true,
//             contextIsolation :  false,
//         }
//     });

//     const child = new BrowserWindow({
//         parent : win
//     })

//     win.loadURL('http://localhost:8080/');
// }

// app.on('ready', ()=> {
//     createBrowser()
// });

// app.on('window-all-closed', ()=>{
//     app.quit()
// });
// import { app, BrowserWindow, dialog } = require('electron')
const { app, BrowserWindow, dialog } = require('electron');


function createBrowser () {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  })

  win.loadURL('http://localhost:8080')

  win.on('close', (event) => {
    const response = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Ya', 'Tidak'],
      title: 'Konfirmasi',
      message: 'Apakah Anda Ingin Menutup Aplikasi?',
      defaultId: 1,
      cancelId: 1
    })

    if (response === 1) {
      event.preventDefault()
    }
  })
}

app.on('ready', () => {
  createBrowser()
})

app.on('window-all-closed', () => {
  app.quit()
})
