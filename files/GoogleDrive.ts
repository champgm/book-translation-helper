// import path from 'path';
import fs from 'fs';
import { authenticate } from '@google-cloud/local-auth';
import { Configuration } from '../configuration';
// import { file_v1 } from 'googleapis';
import { google, docs_v1 } from 'googleapis';
import { Files } from './Files';
import { OAuth2Client } from 'google-auth-library';


export class GoogleDrive implements Files {

    /**
   * Attempts to load cached Google Drive API credentials
   * @param config 
   * @returns 
   */
    private async loadSavedCredentialsIfExist(config: Configuration) {
        try {
            const content = fs.readFileSync(config.savedOathToken);
            const credentials = JSON.parse(content.toString());
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    /**
   * Saves credentials to disk for use later.
   * @param config 
   * @param client 
   */
    private async saveCredentials(config: Configuration, client: OAuth2Client) {
        if (config.logs) if (config.logs) console.log(`Saving credentials to ${config.savedOathToken}`);
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

    /**
   * Retrieves auth info via @google-cloud/local-auth
   * @param config 
   * @returns 
   */
    private async authorize(config: Configuration) {
        const savedClient = await this.loadSavedCredentialsIfExist(config);
        if (savedClient) {
            return savedClient;
        }
        const client = await authenticate({
            scopes: 'https://www.googleapis.com/auth/documents',
            keyfilePath: config.oauthClientSecret,
        });
        if (client.credentials) {
            await this.saveCredentials(config, client);
        }
        return client;
    }

    public async saveFile(
        config: Configuration,
        fileContents: string,
    ) {
    // Get auth & instantiate the docs client
        const authClient = (await this.authorize(config)) as OAuth2Client;
        const docs = new docs_v1.Docs({ auth: authClient });

        // Docs can't be created with contents, it seems.
        const createResponse = await docs.documents.create({
            requestBody: { title: config.documentName },
        });
        if (config.logs) console.log(`Document createResponse: ${JSON.stringify(createResponse)}`);

        if (!createResponse.data.documentId) {
            if (config.logs) console.log('No documentId included in response, document create failed?');
            throw new Error('No documentId included in response, document create failed?');
        }

        // I assume, if this isn't 
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
        if (config.logs) console.log(`Document updateResponse: ${JSON.stringify(updateResponse)}`);
    }
}
