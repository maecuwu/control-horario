// Angular
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// Ionic
import { PopoverController } from '@ionic/angular';

// Components
import { PopoverErrorLoginComponent } from '../../components/popover-error-login/popover-error-login.component';

// Services
import { AuthService } from '../../services/auth.service';
import { ParameterService } from '../../services/parameter.service';
import { HelperService } from '../../services/helper.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario = {
    email: '',
    password: ''
  };

  constructor(private popoverController: PopoverController,
              private authservice: AuthService,
              private router: Router,
              private parameterService: ParameterService,
              private helperService: HelperService,
              private configService: ConfigService) { }

  async ngOnInit() {
  }

  async onSubmit(form: NgForm){
    try{
      const authData = await this.authservice.login(this.usuario.email, this.usuario.password);
      await this.authservice.storeUserData(authData);
      if (authData){
        form.resetForm();
      }
    }
    catch (error){
      console.log('ERRORLOGIN', error);
      form.resetForm();
      this.presentPopover();
      return;
    }
    // check if location active
    const parameters = await this.parameterService.get();
    if(parameters){
      if(parameters.geolocation){
        // Enable geolocation
        await this.helperService.getLocationPermissions();
      }
      //set Logo
      if( parameters.logo ){
        this.configService.setLogo( parameters.logo );
      }
    }

    //Navigate home
    this.router.navigate(['/home']);
  }

  private async presentPopover() {
    const popover = await this.popoverController.create({
      component: PopoverErrorLoginComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true
    });
    await popover.present();
  }

}
