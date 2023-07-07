import path from 'path';
import fs from 'fs';
import { GoogleDrive } from './files/GoogleDrive';
import { Translation } from './translate/Translation';
import { VisionOcr } from './ocr/VisionOcr';
import { config, Configuration } from './configuration';
import { getOptions } from './options';

const commander = getOptions();
const options: Configuration = { ...config, ...commander };

// async function useGoogleTranslate



async function doIt() {
    if (!fs.existsSync(options.input)) {
        console.log(`Folder path "${options.input}" does not exist.`);
        return;
    }

    let filePaths: string[] = [];
    if (options.input.endsWith('.jpg')) {
        filePaths = [options.input];
    } else {
        filePaths = fs.readdirSync(options.input).map((fileName) => {
            return path.join(options.input, fileName);
        });
    }

    console.log('All file paths:');
    for (const filePath of filePaths) {
        console.log(`\t${filePath}`);
    }

    console.log('Running OCR...');
    const ocr = new VisionOcr();
    const ocredTexts = await ocr.getText(options, filePaths);

    console.log('Translating...');
    const translate = new Translation();
    const translatedTexts = await translate.translateText(options, ocredTexts);
    console.log('\n\n');

    // Make sure OCRs and translations are same length
    // I can't imagine why they wouldn't be, but who knows
    if (
        filePaths.length != ocredTexts.length
    || filePaths.length != translatedTexts.length
    ) {
        console.log('Unexpected number of OCRs/Translations.');
        console.log('Files: ');
        for (const filePath of filePaths) {
            console.log(`\t${filePath.trim()}`);
        }
        console.log('OCRed Texts: ');
        for (const text of ocredTexts) {
            console.log(`\t${text.trim()}`);
        }
        console.log('Translated Texts: ');
        for (const text of translatedTexts) {
            console.log(`\t${text.trim()}`);
        }
    }

    // This output can be helpful when debugging or
    // manually cleaning up the file later
    console.log('All Translated Text: ');
    for (let index = 0; index < translatedTexts.length; index++) {
        const filePath = filePaths[index];
        const ocredText = ocredTexts[index];
        const translatedText = translatedTexts[index];
        console.log(`File: ${filePath.trim()}`);
        console.log(`\tOriginal text  : ${ocredText.trim()}`);
        console.log(`\tTranslated text: ${translatedText.trim()}\n`);
    }

    console.log('Writing to google drive...');
    const files = new GoogleDrive();
    await files.saveFile(
        options,
        translatedTexts.join('\n'),
    );
}

doIt().then(() => {
    console.log('All done.');
});
