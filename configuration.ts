
export class Configuration {
    /**
   * You can generate one of these files here:
   * https://console.cloud.google.com/iam-admin/serviceaccounts
   */
    public serviceAccountKeyFilePath = '';

    /**
   * You can generate one of these files here:
   * https://console.cloud.google.com/apis/credentials
   */
    public oauthClientSecret = '';

    /**
   * Sample example here:
   * https://developers.google.com/drive/api/quickstart/nodejs
   * ctrl+f for loadSavedCredentialsIfExist
   */
    public savedOathToken = '';

    // These values will be populated by command line options
    public logs = false;
    public input = '';
    public documentName = '';
    public to = '';
    public from = '';
    public minimumConfidence = 0;
}

/**
 * Default configuration values
 */
export const config: Configuration = {
    serviceAccountKeyFilePath: `${__dirname}/serviceAccountKeyFile.json`,
    oauthClientSecret: `${__dirname}/clientSecret.json`,
    savedOathToken: `${__dirname}/savedOauthToken.json`,
    logs: false,
    input: '',
    documentName: '',
    to: 'en',
    from: 'zh',
    minimumConfidence: 0,
};
