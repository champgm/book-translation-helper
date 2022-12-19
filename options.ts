
import { OptionValues, program } from 'commander';

export function getOptions(): OptionValues {
  program
    .requiredOption('-i, --input <path>', 'file or folder path containing images')
    .requiredOption('-d, --documentName <name>', 'name for the document which will contain translated text')
    .option('-f, --from <language>', 'language code from which to translate', 'zh')
    .option('-t, --to <language>', 'language code to which to translate', 'en')
    .option('-c, --minimumConfidence <decimal>', 'minimum confidence (decimal, 0-1) that a portion of detected text is actually text', '0.8')
    .option('-l, --logs', 'output debug logs');
  program.parse();
  return program.opts();
}
