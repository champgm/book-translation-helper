
export class Configuration {
  /**
   * You can generate one of these files here:
   * https://console.cloud.google.com/iam-admin/serviceaccounts
   */
  public serviceAccountKeyFilePath: string = "";

  /**
   * You can generate one of these files here:
   * https://console.cloud.google.com/apis/credentials
   */
  public oauthClientSecret: string = "";

  /**
   * Sample example here:
   * https://developers.google.com/drive/api/quickstart/nodejs
   * ctrl+f for loadSavedCredentialsIfExist
   */
  public savedOathToken: string = "";

  public debugLogs: boolean = true;
}

export const config: Configuration = {
  serviceAccountKeyFilePath: `${__dirname}/serviceAccountKeyFile.json`,
  oauthClientSecret: `${__dirname}/clientSecret.json`,
  savedOathToken: `${__dirname}/savedOauthToken.json`,
  debugLogs: false,
}
