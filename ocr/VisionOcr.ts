import { Ocr } from './Ocr';
import { v1p1beta1, protos } from '@google-cloud/vision';
import { Configuration } from '../configuration';
import { omitDeep } from '../omitDeep';
// import { google } from '@google-cloud/vision'

export class VisionOcr implements Ocr {

  private wordIsInDesiredLanguage(
    config: Configuration,
    word: protos.google.cloud.vision.v1.IWord,
  ): boolean {
    if (!word.property?.detectedLanguages) {
      return false;
    }
    return word.property?.detectedLanguages?.some((language) => {
      return config.from == language.languageCode;
    });
  }

  /**
* Yeah words are deep down in the image response.
* @param config 
* @param annotateImageResponse 
* @returns all words found in an image annotation response
*/
  private extractWords(
    config: Configuration,
    annotateImageResponse: protos.google.cloud.vision.v1.IAnnotateImageResponse
  ): protos.google.cloud.vision.v1.IWord[] {
    const words: protos.google.cloud.vision.v1.IWord[] = [];
    for (const page of annotateImageResponse.fullTextAnnotation?.pages || []) {
      for (const block of page.blocks || []) {
        for (const paragraph of block.paragraphs || []) {
          for (const word of paragraph.words || []) {
            words.push(word);
          }
        }
      }
    }
    return words;
  }

  public async getText(
    config: Configuration,
    filePaths: string[],
  ): Promise<string[]> {
    if (filePaths.length == 0) {
      if (config.logs) console.log('No image buffers provided, returning.');
      return [];
    }

    const client = new v1p1beta1.ImageAnnotatorClient({
      keyFilename: config.serviceAccountKeyFilePath,
    });

    const results: string[] = [];
    if (config.logs) console.log('Received a single image buffer, annotating single image.');
    for (const filePath of filePaths) {
      const requestParameters = {
        image: { source: { filename: filePath }, },
        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
        imageContext: { languageHints: [config.from] }
      };

      if (config.logs) console.log(`Sending OCR request: ${JSON.stringify(requestParameters)}`);
      const result = (await client.annotateImage(requestParameters))[0];

      if (config.logs) {
        // The result is crazy big. If it needs to be logged, it's best to drop some fields first.
        const sanitizedResult = omitDeep(result, ['boundingBox', 'boundingPoly', 'textAnnotations']);
        if (config.logs) console.log(`Sanitized annotation result: ${JSON.stringify(sanitizedResult)}`);
      }

      let extractedText = '';
      if (config.logs) console.log('Extracting text from result...');
      for (const word of this.extractWords(config, result)) {
        let extractedWord = '';
        if (config.logs) console.log(`Found a word, it has ${word.symbols?.length} symbols.`);
        for (const symbol of word.symbols || []) {
          // Sometimes Google Vision will detect letters/characters in the scenery
          if ((symbol.confidence || 0) >= config.minimumConfidence) {
            extractedWord = extractedWord.concat(symbol.text || '');

            // In Chinese, spaces are probably false positives. 
            // Either way, they aren't necessary and translation seems to
            // improve quite a bit when they are ignored.
            // Same thing goes for line breaks.
            if (config.from == 'zh') continue;

            if ( // If it's any other language (I guess) whitespace is important.
              symbol.property?.detectedBreak?.type == 'SPACE'
              || symbol.property?.detectedBreak?.type == 'SURE_SPACE'
              // It still helps to get rid of line breaks though.
              || symbol.property?.detectedBreak?.type == 'LINE_BREAK'
              || symbol.property?.detectedBreak?.type == 'EOL_SURE_SPACE'
            ) {
              extractedWord = extractedWord.concat(' ');
            }
          } else {
            if (config.logs) console.log(`Confidence of ${symbol.confidence} lower than minimum, ${config.minimumConfidence}, will not extract symbol, "${symbol.text}"`);
          }
        }
        if (this.wordIsInDesiredLanguage(config, word)) {
          if (config.logs) console.log(`Extracted word, "${extractedWord}"`);
          extractedText = extractedText.concat(extractedWord);
        } else if (config.logs) {
          if (config.logs) console.log(`Extracted word, "${extractedWord}" was in language, "${word.property?.detectedLanguages}" not the expected language: ${config.from}`);
        }
      }
      if (config.logs) console.log(`Full Text: ${result.fullTextAnnotation?.text}`);
      if (config.logs) console.log(`Filtered text: ${extractedText}\n`);
      results.push(`${extractedText}\n`);
    }

    return results;
  }
}
