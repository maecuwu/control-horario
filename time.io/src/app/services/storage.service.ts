import { Injectable } from '@angular/core';



import { Storage } from '@capacitor/storage';



@Injectable({

  providedIn: 'root'

})

export class StorageService {



  constructor() { }



  public async set(key: string, value: any): Promise<void> {

    await Storage.set({

      key,

      value: JSON.stringify(value)

    });

  }



  public async get(key: string): Promise<any> {

    const item = await Storage.get({ key });

    return JSON.parse(item.value);

  }



  public async remove(key: string): Promise<void> {

    return await Storage.remove({ key });

  }

}
