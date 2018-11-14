import { exportLines } from './ItemService'

export async function saveLinesAsCsv (context) {
  const json2csv = import(/* webpackChunkName: "csv" */ 'json2csv')
  const data = await exportLines(context)
  const csv = (await json2csv).parse(data)

  await writeData(window.cordova.file.dataDirectory, 'password.csv', csv)
}

async function writeData (directory, filename, data) {
  const fs = await resolveLocalFileSystemURLPromise(directory)
  const fileEntry = await getFilePromise(fs, filename)

  await writeFile(fileEntry, data)
}

async function resolveLocalFileSystemURLPromise (directory) {
  return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(directory, resolve, reject))
}

async function getFilePromise (fs, filename) {
  return new Promise((resolve, reject) => fs.getFile(filename, { create: true, exclusive: false }, resolve, reject))
}

async function writeFile (fileEntry, dataObj) {
  return new Promise((resolve, reject) => {
    fileEntry.createWriter(fileWriter => {
      fileWriter.onwriteend = () => resolve()
      fileWriter.onerror = e => reject(new Error('Failed file write: ' + e.toString()))
      fileWriter.write(dataObj)
    })
  })
}
