# book-translation-helper
This helper is primarily meant to automate some manual steps I have been doing lately to translate picture books.

Workflow Before:
* Use Google Lens to capture blocks of text
* Send each one to my computer
* Put them through translate.google.com
* Copy/paste them into a Google Doc
* Manually inspect & clean up the translation
* Print that on label paper, cut them out, stick them in the book

Workflow now:
* Take pictures of each block of text
* Let them sync to Google Photos
* Download them all locally as an archive
* Run this script, it will:
  * Iterate over each block of text
  * Use Google Vision to recognize text
  * Use Google Translate to translate it
  * Compile all translations
  * Create a new Google Doc populated with the translations
* Manually inspect & clean up the translation
* Print that on label paper, cut them out, stick them in the book

An example input image (scaled down to save space):

![chinese book cover](https://github.com/champgm/book-translation-helper/blob/main/README/example-zh.png)

Console output would show something like this:
```
File: C:\Users\me\Downloads\Photos-001\example.jpg
        Original text  : 全景式图画书坐电车去旅行从大海到高山
        Translated text: Panoramic Picture Book Take a Tram to Travel From the Sea to the Mountain
```

Or, In the other direction:

![english book page](https://github.com/champgm/book-translation-helper/blob/main/README/example-en.png)

Would output something like this to the console:
```
File: /Users/gchampion/Downloads/Photos-001/PXL_20221219_014111414.jpg
        Original text  : Beep! Beep! Beep! December's here! Little Blue Truck is full of cheer.
        Translated text: 嘟！嘟！嘟！十二月来了！小蓝卡车欢呼雀跃。
```

The full batch of text shows up in a new Google Doc in the root of my Google Drive. I manually check & clean up the translation (with help, when necessary), shape the text into blocks that fit onto each page, print the Google Doc on label paper, cut out each block of text, and stick them on the correct pages.

## Configuration
Check [options.ts](https://github.com/champgm/book-translation-helper/blob/main/options.ts) or run `ts-node index --help` to see the command line options. Unless I forget to update the README, here are the current options:
```
 ⇒ ts-node index.ts --help
Usage: index [options]

Options:
  -i, --input <path>                 file or folder path containing images
  -d, --documentName <name>          name for the document which will contain translated text
  -f, --from <language>              language code from which to translate (default: "zh")
  -t, --to <language>                language code to which to translate (default: "en")
  -c, --minimumConfidence <decimal>  minimum confidence (decimal, 0-1) that a portion of detected text is actually text. Default is 0 but if you get weird stuff picked up in your results, try setting it higher. (default: "0")
  -l, --logs                         output debug logs
  -h, --help                         display help for command
```

### Google API/Cloud secrets
Using [configuration.ts](https://github.com/champgm/book-translation-helper/blob/main/configuration.ts), you can change where the script will look for the various types of auth & configuration that the Google services require. 

`serviceAccountKeyFile.json` should hold the output Google's Cloud console gives you when you create a new service account. You can do that on the [Google Cloud service account](https://console.cloud.google.com/iam-admin/serviceaccounts) page.

`savedOauthToken.json` should hold the client OAuth secret & token for Google Cloud. You can create one of those on the [Google Cloud API credentials](https://console.cloud.google.com/apis/credentials) page.

`savedOauthToken.json` will be created on first use. The [googleapis](https://www.npmjs.com/package/googleapis) library will start a browser instance for you to approve access to the script



## Usage Example
```
ts-node index `
--input "C:\Users\me\Downloads\Photos-001" `
--documentName "Translated Book" `
--from zh `
--to en `
--minimumConfidence 0
```
or
```
ts-node index \
--input "/Users/me/Downloads/Photos-001" \
--documentName "Translated Book" \
--from zh \
--to en \
--minimumConfidence 0
```

## Notes

If you run into an auth problem when writing the Google document, delete `savedOauthToken.json` and try again.

If you need some help understanding why the OCR API is returning the text that it is, there's a decently helpful GUI for it here: https://cloud.google.com/vision/docs/drag-and-drop

Sometimes, in VisionOcr, you can get better results if you switch the image annotation type from `DOCUMENT_TEXT_DETECTION` to `TEXT_DETECTION`, but this will almost always result in no text detected at all.

If all else fails, you can upload images to Google Translate and it sometimes has better luck: https://translate.google.com/?sl=auto&tl=en&op=images


## Misc Links

https://cloud.google.com/translate/docs/hybrid-glossaries-tutorial#node.js
https://cloud.google.com/nodejs/docs/reference/vision/latest
