import { Configuration } from '../configuration';

/**
 * Interface for translation
 */
export interface Translate {
  /**
   * Translates the given lines or blocks of text
   * @param config Configuration parameters
   * @param originalTexts Lines or blocks of text to be translated
   * @returns Translated text in the same order as the original text given
   */
  translateText(
    config: Configuration,
    originalTexts: string[],
  ): Promise<string[]>;
}
