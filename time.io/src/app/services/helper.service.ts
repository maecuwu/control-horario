// Angular
import { Injectable } from '@angular/core';

//Capacitor
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private storageService: StorageService) { }

  public async getLocationPermissions() {
    if (!await Geolocation.checkPermissions()) {
      try {
        await Geolocation.requestPermissions();
        this.setAllowLocation(true);
        return true;
      } catch (error) {
        this.setAllowLocation(false);
        return false;
      }
    } else {
      this.setAllowLocation(true);
      return true;
    }
  }

  public async getLocation() {
    await this.getLocationPermissions();
    if (await this.storageService.get('AllowLocation') === true) {
      try {
        await Geolocation.requestPermissions();
            return await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              maximumAge: 5000,
              timeout: 10000
            });
      } catch (error) {
        console.log('VS: HelperService -> getLocation -> error', error);
        return null;
      }
    }
  }

  private setAllowLocation(status: boolean) {
    this.storageService.set('AllowLocation', status);
  }

}
