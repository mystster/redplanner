export class User {
  public id?: number;
  public login?: string;
  public admin?: boolean;
  public firstname?: string;
  public lastname?: string;
  public mail?: string;
  public createdOn?: string;
  public lastLoginOn?: string;
  public apiKey?: string;
  public status?: number;

  constructor(json: any) {
    Object.assign(this, json);
  }
}
