/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
// Angular
import { Injectable } from '@angular/core';

// App
import { ConfigService } from './config.service';
import { TimeControl } from '../models/time-control.model';

//Capacitor
import { Http } from '@capacitor-community/http';
import { Token } from '../models/auth.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TimeControlService {

  private token: Token;

  constructor(private config: ConfigService,
    private storageService: StorageService) { }

  public async getActiveSession(userName: string, isBreak: boolean = false) {
    this.token = JSON.parse(await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/timecontrol/active-session/' + userName + '/' + isBreak,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.get(options)).data;
  }

  public async isInAbsence(userName: string) {
    this.token = JSON.parse(await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/holidays/is-in-absence/' + userName,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.get(options)).data;
  }

  public async createSession(session: TimeControl) {
    this.token = JSON.parse(await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/timecontrol',
      data: session,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.post(options)).data;
  }

  public async putSession(session: TimeControl) {
    this.token = JSON.parse(await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/timecontrol/' + session.id,
      data: session,
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.put(options)).data;
  }

  public async getDailyReport(company: string, userName: string, fromDate: string, toDate: string) {
    this.token = JSON.parse(await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/timecontrol/daily-report/' + fromDate + '/' + toDate + '/' +
        company + '/' + userName,
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.get(options)).data;
  }

}
