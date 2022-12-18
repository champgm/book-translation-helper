
import { OptionValues, program } from 'commander';

export function getOptions(): OptionValues {
  program
    .requiredOption('-i, --input <path>', 'file or folder path containing images')
    .requiredOption('-d, --document <name>', 'name for the document which will contain translated text')
    .option('-f, --from <language>', 'language code from which to translate, default is "zh"', 'zh')
    .option('-t, --to <language>', 'language code to which to translate, default is "en"', 'en')
    .option('-l, --logs', 'output debug logs');
  return program.opts();
}
