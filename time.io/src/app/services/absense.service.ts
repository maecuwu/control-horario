/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Injectable } from '@angular/core';
import { Token } from '../models/auth.model';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';
import { Absence } from '../models/absence.model';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class AbsenseService {

  private token: Token;

  constructor(private config: ConfigService,
    private storageService: StorageService) { }


  public async create(ausencia: Absence){
    this.token = JSON.parse( await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/holidays',
      data: ausencia,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.post(options)).data;
  }

  public async getAbsences(startDate: string, endDate: string, company: string, userName: string){
    this.token = JSON.parse( await this.storageService.get('tokenInfo'));
    const options = {
      url: this.config.apiUrl + '/holidays/' + startDate + '/' + endDate
        + '/' + company + '/' + userName,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token.token
      }
    };
    return await (await Http.get(options)).data;
  }
}
