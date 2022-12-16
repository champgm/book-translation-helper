import path from 'path'
import fs from 'fs'
import { VisionOcr } from './ocr/VisionOcr';
import { Translation } from './translate/Translation';
import { GoogleDrive } from './files/GoogleDrive';

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

  const ocr = new VisionOcr();
  const fullText = await ocr.getText(filePaths, ['zh'], 0.8);
  console.log(`\n\n`);

  const translate = new Translation();
  const translatedText = await translate.translateText(fullText, "zh", "en");
  console.log(`\n\n`);

  const files = new GoogleDrive();
  await files.saveFile(
    fileName,
    translatedText.join('\n'),
  );

  console.log(`All done?`);

}





doIt().then(() => {
  console.log(``);
});
