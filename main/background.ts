import path from 'path'
import { app, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import fs from 'fs'

const isProd = process.env.NODE_ENV === 'production'

ipcMain.on('selectFolder', async (event, value) => {
  const selectedFolder = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  event.reply('folderPath', [selectedFolder.filePaths[0], value])
})

ipcMain.on('transfer', async (event, values) => {
  var extJogos = values.extensoesJogos.filter(v => v.checked).map(v => v.extension)
  var extSaves = values.extensoesSaves.filter(v => v.checked).map(v => v.extension)
  var substituiArquivos = values.substituiArquivos
  const files = fs.readdirSync(values.origemPath, { withFileTypes: true, recursive: true })
    .filter((v) => v.isFile())
    .filter(v => {
      if (values.chkBackupTodos)
        return true
      else if (extJogos.length === 0 && extSaves.length === 0)
        return false

      let fileExtension = path.extname(v.name).replace('.', '')
      if (fileExtension.includes('state'))
        fileExtension = 'state'
      return extJogos.includes(fileExtension) || extSaves.includes(fileExtension)
    })
    .map((v) => v.path + "\\" + v.name)

  event.reply('total', files.length)

  var progress = 0
  for (const file of files) {
    progress++
    event.reply('progresso', progress)
    const fileParts = file.split('\\')
    var pathTest = ''
    const origemParts = values.origemPath.split('\\')

    for (var j = origemParts.length; j < fileParts.length - 1; j++) {
      pathTest += "\\" + fileParts[j]
    }

    pathTest = values.destinoPath + pathTest

    var pasta = ''
    var pathParts = pathTest.split("\\")
    for (var k = 0; k < pathParts.length; k++) {
      pasta += pathParts[k] + "\\"
      if (!fs.existsSync(pasta)) {
        fs.mkdir(pasta, (err) => {
          if (err) throw err;
        });
      }
    }
    const ultimo = file.split("\\")
    const ultimoIdx = file.split("\\").length - 1

    var destino = pathTest + "\\" + ultimo[ultimoIdx]

    event.reply('nome', file)
    try {
      fs.copyFileSync(file, destino, substituiArquivos ? null : fs.constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code == 'EEXIST')
        event.reply('log', { text: `${file} não foi transferido pois o mesmo já existe na pasta destino...\n`, error: true })
      else
        event.reply('log', { text: `${file} não foi transferido pois um erro inesperado ocorreu...\n`, error: true })
    }
  }
  event.reply('fim')
})

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})