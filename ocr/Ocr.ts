import { Configuration } from '../configuration';

/**
 * Interface for Optical Character Recognition
 */
export interface Ocr {
  /**
   * Attempts to recognize text for a set of files
   * @param config Configuration parameters
   * @param filePaths An array of file paths to images that should be processed
   * @param languageHints Any hints you'd like to provide about the language(s) in the picture
   */
  getText(
    config: Configuration,
    filePaths: string[],
    languageHints: string[],
  ): Promise<string[]>;
}
