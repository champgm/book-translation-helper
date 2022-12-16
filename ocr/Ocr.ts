export interface Ocr {
  getText(
    filePaths: string[],
    languageHints: string[],
    minimumConfidence:number,
  ): Promise<string[]>;
}
