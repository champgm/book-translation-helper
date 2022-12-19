import { Configuration } from "../configuration";

export interface Ocr {
  getText(
    config: Configuration,
    filePaths: string[],
    languageHints: string[],
  ): Promise<string[]>;
}
