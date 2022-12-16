import { Translate } from "./Translate";
import { v2 } from '@google-cloud/translate';
import { config } from "../configuration";

export class Translation implements Translate {
  async translateText(originalText: string[], fromLanguage: string, toLanguage: string): Promise<string[]> {
    if (originalText.length == 0) return [];

    const client = new v2.Translate({
      keyFilename: config.serviceAccountKeyFilePath,
    });

    const results: string[] = [];
    for (const text of originalText) {
      const result = await client.translate(text, {
        format: "text",
        from: "zh",
        // model?: string;
        to: "en",
      });
      console.log(`Got a result: `);
      console.log(`Original  : ${text}`);
      console.log(`Translated: ${result[0]}`);
      console.log(`Metadata: ${JSON.stringify(result[1], null, 2)}`);
      results.push(result[0]);
    }
    return results;
  }
}