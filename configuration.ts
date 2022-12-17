
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

  public logs: boolean = true;
  public input: string;
  public document: string;
  public to: string;
  public from: string;
}

export const config: Configuration = {
  serviceAccountKeyFilePath: `${__dirname}/serviceAccountKeyFile.json`,
  oauthClientSecret: `${__dirname}/clientSecret.json`,
  savedOathToken: `${__dirname}/savedOauthToken.json`,
  logs: false,
  input: "",
  document: "",
  to: "en",
  from: 'zh',
}
