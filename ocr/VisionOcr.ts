import { Ocr } from "./Ocr";
import { v1p1beta1 } from '@google-cloud/vision';
import { Configuration } from "../configuration";
import { omitDeep } from "../omitDeep";

export class VisionOcr implements Ocr {
  public async getText(
    config: Configuration,
    filePaths: string[],
    languageHints: string[],
    minimumConfidence: number,
  ): Promise<string[]> {
    if (filePaths.length == 0) {
      if (config.logs) console.log(`No image buffers provided, returning.`);
      return [];
    }

    const client = new v1p1beta1.ImageAnnotatorClient({
      keyFilename: config.serviceAccountKeyFilePath,
    });

    const results: string[] = [];
    if (config.logs) console.log(`Received a single image buffer, annotating single image.`);
    for (const filePath of filePaths) {
      const requestParameters = {
        image: { source: { filename: filePath }, },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
        imageContext: { languageHints }
      };
      let result = (await client.annotateImage(requestParameters))[0];
      result = omitDeep(result, ['boundingBox', 'boundingPoly', 'textAnnotations'])
      if (config.logs) console.log(`Sanitized annotation result: ${JSON.stringify(result)}`);

      if (config.logs) console.log(`Extracting text from result...`);
      let extractedText = '';
      for (const page of result.fullTextAnnotation?.pages || []) {
        if (config.logs) console.log(` Found a page...`);
        for (const block of page.blocks || []) {
          if (config.logs) console.log(`  Found a block...`);
          for (const paragraph of block.paragraphs || []) {
            if (config.logs) console.log(`   Found a paragraph...`);
            for (const word of paragraph.words || []) {
              if (config.logs) console.log(`    Found a word...`);
              const rightLanguage =
                word.property?.detectedLanguages?.some((language) => {
                  return languageHints.includes(language.languageCode || 'NONE');
                });
              if (rightLanguage) {
                if (config.logs) console.log(`     Word matches expected language(s).`);
                for (const symbol of word.symbols || []) {
                  if ((symbol.confidence || 0) >= minimumConfidence) {
                    extractedText = extractedText.concat(symbol.text || '');
                  }
                  // if (symbol.property?.detectedBreak) {
                  //   extractedText = extractedText.concat();
                  // }
                }
              } else {
                if (config.logs) console.log(`Word was not in the expected language(s).`);
              }
            }
          }
        }
      }
      if (config.logs) console.log(`Full Text: ${result.fullTextAnnotation?.text}`);
      if (config.logs) console.log(``);
      if (config.logs) console.log(`Filtered text: ${extractedText}`);
      results.push(`${extractedText}\n`);
      if (config.logs) console.log(``);
    }

    return results;
  }
}
