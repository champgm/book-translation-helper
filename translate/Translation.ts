import { Translate } from "./Translate";
import { v2 } from '@google-cloud/translate';
import { Configuration } from "../configuration";

export class Translation implements Translate {
  async translateText(
    config: Configuration,
    originalText: string[],
  ): Promise<string[]> {
    if (originalText.length == 0) return [];

    const client = new v2.Translate({
      keyFilename: config.serviceAccountKeyFilePath,
    });

    const results: string[] = [];
    for (const text of originalText) {
      const result = await client.translate(text, {
        format: "text",
        from: config.from,
        to: config.to,
      });
      if (config.logs) console.log(`Got a result: `);
      if (config.logs) console.log(`Original  : ${text}`);
      if (config.logs) console.log(`Translated: ${result[0]}`);
      if (config.logs) console.log(`Metadata: ${JSON.stringify(result[1])}`);
      results.push(result[0]);
    }
    return results;
  }
}
