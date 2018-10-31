export let updateLine

export function setUpdateLineHandler (handler) {
  updateLine = handler
}

export let removeLine

export function setRemoveLineHandler (handler) {
  removeLine = handler
}

export let exportLinesAsCsv

export function setExportLinesAsCsvHandler (handler) {
  exportLinesAsCsv = handler
}
