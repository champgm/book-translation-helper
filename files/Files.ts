import { Configuration } from "../configuration";

export interface Files {
  saveFile(
    config: Configuration,
    fileContents: string,
  ): Promise<void>;
}
