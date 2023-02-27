/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
// Angular
import { Injectable } from '@angular/core';

// Vendors
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';

// Capacitor
import { StorageService } from './storage.service';
import { Http } from '@capacitor-community/http';

// App
import { ConfigService } from './config.service';
import { ForgotPassword, ResetPassword, Token } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private configService: ConfigService,
    private storageService: StorageService) { }

  public async login(email: string, password: string) {
    const options = {
      url : this.configService.apiUrl + '/auth/token',
      headers: { 'Content-Type': 'application/json' },
      data: { email, password }
    };
    return await (await Http.post(options)).data;
  }

  public logout() {
    // Remove user from local storage to log user out
    this.storageService.remove('payload');
    this.storageService.remove('tokenInfo');
    this.storageService.remove('currentUser');
  }

  public async isAuthenticated(): Promise<boolean> {
    const tokenInfo = JSON.parse(await this.storageService.get('tokenInfo'));

    let expiration: number;
    let now: number;
    let token: string;

    // Get expiration and now values
    if (tokenInfo) {
      expiration = Date.parse(tokenInfo.expiration);
      now = Date.parse((new Date()).toISOString());
      token = tokenInfo.token;

      if (token && expiration > now) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public async forgotPassword(model: ForgotPassword) {
    const options = {
      url: this.configService.apiUrl + '/auth/forgot-password', model
    };
    return await Http.post(options);
  }

  public async resetPassword(model: ResetPassword) {
    const options = {
      url: this.configService.apiUrl + '/auth/reset-password', model
    };
    return await Http.post(options);
  }

  public async getPayload(): Promise<any> {
    return JSON.parse(await this.storageService.get('payload'));
  }

  public async getUser(): Promise<User> {
    return JSON.parse(await this.storageService.get('currentUser'));
  }

  public isInRole(role: string) {
    const roles: string[] = this.getRoles();
    return roles.includes(role);
  }

  public isAdmin(): boolean {
    return this.isInRole('Admin');
  }

  public async isSuperAdmin(): Promise<boolean> {
    return (await this.getUser()).email === 'developer@visiblesoft.com';
  }

  public getRoles() {
    const payload = this.getPayload();
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  public async storeUserData(token: Token) {
    const payload = this.decodeJwt(token.token);
    this.storageService.set('payload', JSON.stringify(payload));

    const tokenStored = new Token();
    tokenStored.expiration = moment.unix(payload.exp).toISOString();
    tokenStored.token = token.token;
    this.storageService.set('tokenInfo', JSON.stringify(tokenStored));

    // Get current user
    const options = {
      url: this.configService.apiUrl + '/users/by-username/' + payload.sub,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token.token
      }
    };
    const currentUser = (await Http.get(options)).data;
    this.storageService.set('currentUser', JSON.stringify(currentUser));
  }

  private decodeJwt(token: string): any {
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }
  }
}
