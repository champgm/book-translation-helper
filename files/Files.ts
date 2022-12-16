export interface Files {
  saveFile(
    fileName: string,
    // fileFolderPath: string,
    fileContents: string,
  ): Promise<void>;
}
