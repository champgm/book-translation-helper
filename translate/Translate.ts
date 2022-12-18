import { Configuration } from "../configuration";

export interface Translate {
  translateText(
    config: Configuration,
    originalTexts: string[],
    fromLanguage: string,
    toLanguage: string,
  ): Promise<string[]>;
}
