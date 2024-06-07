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
  const extJogos = values.extensoesJogos.filter(v => v.checked).map(v => v.extension);
  const extSaves = values.extensoesSaves.filter(v => v.checked).map(v => v.extension);
  const substituiArquivos = values.substituiArquivos;

  const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    });

    return arrayOfFiles;
  };

  const files = getAllFiles(values.origemPath, [])
    .filter((file) => {
      if (values.chkBackupTodos) return true;
      if (extJogos.length === 0 && extSaves.length === 0) return false;

      let fileExtension = path.extname(file).replace('.', '');
      if (fileExtension.includes('state')) fileExtension = 'state';
      return extJogos.includes(fileExtension) || extSaves.includes(fileExtension);
    });

  event.reply('total', files.length);

  let progress = 0;
  for (const file of files) {
    progress++;
    event.reply('progresso', progress);

    const relativePath = path.relative(values.origemPath, path.dirname(file));
    const destinationDir = path.join(values.destinoPath, relativePath);

    fs.mkdirSync(destinationDir, { recursive: true });

    const destinationFile = path.join(destinationDir, path.basename(file));

    event.reply('nome', file);
    try {
      fs.copyFileSync(file, destinationFile, substituiArquivos ? 0 : fs.constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code === 'EEXIST') {
        event.reply('log', { text: `${file} não foi transferido pois o mesmo já existe na pasta destino...\n`, error: true });
      } else {
        event.reply('log', { text: `${file} não foi transferido pois um erro inesperado ocorreu...\n`, error: true });
      }
    }
  }
  event.reply('fim');
});

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