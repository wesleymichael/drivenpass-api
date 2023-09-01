import { faker } from '@faker-js/faker';

export class BodyWifi {
  private _title: string;
  private _name: string;
  private _password: string;

  constructor(title?: string, name?: string, password?: string) {
    this._title = title || faker.internet.email();
    this._name = name || `${faker.person.firstName()}'s wifi`;
    this._password = password || faker.internet.password();
  }

  generate() {
    return {
      title: this._title,
      name: this._name,
      password: this._password,
    };
  }
}
