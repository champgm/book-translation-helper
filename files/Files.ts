import { Configuration } from "../configuration";

export interface Files {
  saveFile(
    config: Configuration,
    fileName: string,
    // fileFolderPath: string,
    fileContents: string,
  ): Promise<void>;
}
