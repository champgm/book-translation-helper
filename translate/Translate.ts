

export interface Translate {
  translateText(originalTexts: string[], fromLanguage: string, toLanguage: string): Promise<string[]>;
}