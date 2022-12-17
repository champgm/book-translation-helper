import path from 'path'
import fs from 'fs'
import { program } from 'commander';
import { VisionOcr } from './ocr/VisionOcr';
import { Translation } from './translate/Translation';
import { GoogleDrive } from './files/GoogleDrive';
import { config, Configuration } from './configuration';

program
  .requiredOption('-i, --input <path>', 'file or folder path containing images')
  .requiredOption('-d, --document <name>', 'name for the document which will contain translated text')
  .option('-f, --from <language>', 'language code from which to translate, default is "zh"', 'zh')
  .option('-t, --to <language>', 'language code to which to translate, default is "en"', 'en')
  .option('-l, --logs', 'output debug logs')
const options: Configuration = { ...program.opts(), ...config };


const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

const folderPath = myArgs[0];
const fileName = myArgs[1];
if (!folderPath) {
  throw new Error("Folder path is required.")
} else {
  console.log(`Folder path: ${folderPath}`);
}
if (!fileName) {
  throw new Error("File name is required.")
} else {
  console.log(`File name: ${folderPath}`);
}



async function doIt() {
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder path does not exist.`);
    return;
  }

  let filePaths: string[] = [];
  if (folderPath.endsWith('.jpg')) {
    filePaths = [folderPath];
  } else {
    filePaths = fs.readdirSync(folderPath).map((fileName) => {
      return path.join(folderPath, fileName);
    });
  }

  console.log(`All file paths:`);
  for (const filePath of filePaths) {
    console.log(`\t${filePath}`);
  }

  console.log(`Running OCR...`);
  const ocr = new VisionOcr();
  const ocredTexts = await ocr.getText(filePaths, ['zh'], 0.8);

  console.log(`Translating...`);
  const translate = new Translation();
  const translatedTexts = await translate.translateText(ocredTexts, "zh", "en");
  console.log(`\n\n`);


  if (
    filePaths.length != ocredTexts.length
    || filePaths.length != translatedTexts.length
  ) {
    console.log(`Unexpected number of OCRs/Translations.`);
    console.log(`Files: `);
    for (const filePath of filePaths) {
      console.log(`\t${filePath}`);
    }
    console.log(`OCRed Texts: `);
    for (const text of ocredTexts) {
      console.log(`\t${text}`);
    }
    console.log(`Translated Texts: `);
    for (const text of translatedTexts) {
      console.log(`\t${text}`);
    }
  }
  console.log(`All Translated Text: `);
  for (let index = 0; index < translatedTexts.length; index++) {
    const filePath = filePaths[index];
    const ocredText = ocredTexts[index];
    const translatedText = translatedTexts[index];

    console.log(`File: ${filePath}`);
    console.log(`\tOriginal text  : ${ocredText}`);
    console.log(`\tTranslated text: ${translatedText}`);
  };

  console.log(`Writing to google drive...`);
  const files = new GoogleDrive();
  await files.saveFile(
    fileName,
    translatedTexts.join('\n'),
  );

  console.log(`All done?`);

}





doIt().then(() => {
  console.log(``);
});
