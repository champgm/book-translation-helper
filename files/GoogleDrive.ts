// import path from 'path';
import fs from 'fs';
import { } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { config } from '../configuration';
// import { file_v1 } from 'googleapis';
import { google, drive_v3, docs_v1 } from 'googleapis';
import { Files } from './Files';
import { OAuth2Client } from 'google-auth-library';


export class GoogleDrive implements Files {

  private async loadSavedCredentialsIfExist() {
    try {
      const content = fs.readFileSync(config.savedOathToken);
      const credentials = JSON.parse(content.toString());
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
   */
  private async saveCredentials(client: OAuth2Client) {
    if (config.debugLogs) if (config.debugLogs) console.log(`Saving credentials to ${config.savedOathToken}`);
    const content = fs.readFileSync(config.oauthClientSecret);
    const keys = JSON.parse(content.toString());
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(config.savedOathToken, payload);
  }

  private async authorize() {
    let savedClient = await this.loadSavedCredentialsIfExist();
    if (savedClient) {
      return savedClient;
    }
    const client = await authenticate({
      scopes: 'https://www.googleapis.com/auth/documents',
      keyfilePath: config.oauthClientSecret,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }


  public async saveFile(
    fileName: string,
    // fileFolderPath: string,
    fileContents: string,
  ) {
    const authClient = await this.authorize();
    const docs = new docs_v1.Docs({ auth: authClient });
    const drive = new drive_v3.Drive({ auth: authClient });

    const createResponse = await docs.documents.create({
      requestBody: {
        title: fileName,
      },
    });
    if (config.debugLogs) console.log(`Document createResponse: ${JSON.stringify(createResponse, null, 2)}`);

    if (createResponse.data.documentId) {
      // const file = await drive.files.get({ fileId: createResponse.data.documentId })
      // if(config.debugLogs) console.log(`Document file: ${JSON.stringify(file, null, 2)}`);
      // await drive.files.update({ fileId: createResponse.data.documentId })
      const updateResponse = await docs.documents.batchUpdate({
        documentId: createResponse.data.documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                // The first text inserted into the document must create a paragraph,
                // which can't be done with the `location` property.  Use the
                // `endOfSegmentLocation` instead, which assumes the Body if
                // unspecified.
                endOfSegmentLocation: {},
                text: fileContents
              }
            }]
        }
      });
      if (config.debugLogs) console.log(`Document updateResponse: ${JSON.stringify(updateResponse, null, 2)}`);
    } else {
      if (config.debugLogs) console.log(`No documentId included in response, document create failed?`);
    }
  }
}
