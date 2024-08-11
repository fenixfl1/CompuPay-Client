export const normalizeFiles = (file: any) => {
  if (Array.isArray(file.fileList)) {
    return file.fileList
  }
}
