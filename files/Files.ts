import { Configuration } from '../configuration';

export interface Files {
  /**
   * Save a string to a file
   * @param config 
   * @param fileContents the contents of the file
   */
  saveFile(
    config: Configuration,
    fileContents: string,
  ): Promise<void>;
}
