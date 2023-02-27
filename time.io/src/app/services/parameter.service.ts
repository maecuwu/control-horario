/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
// Angular
import { Injectable } from '@angular/core';

//Capacitor
import { Http } from '@capacitor-community/http';

// App
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';
import { Token } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {
  private token: Token;

  constructor(private config: ConfigService,
              private storageService: StorageService) { }

  public async get() {
    this.token = JSON.parse( await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/parameters/parameter',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.get(options)).data;
  }
}
