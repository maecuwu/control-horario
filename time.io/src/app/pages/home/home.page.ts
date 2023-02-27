// Angular
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Ionic
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { PopoverController, ModalController } from '@ionic/angular';

// Models
import { User } from 'src/app/models/user.model';
import { TimeControl } from '../../models/time-control.model';

// Components
import { PopoverAbsenceComponent } from '../../components/popover-absence/popover-absence.component';
import { ModalAbsencesPage } from '../modal-absences/modal-absences.page';
import { ModalSessionReportPage } from '../modal-session-report/modal-session-report.page';

// Services
import { AuthService } from '../../services/auth.service';
import { ParameterService } from '../../services/parameter.service';
import { HelperService } from '../../services/helper.service';
import { TimeControlService } from 'src/app/services/time-control.service';
import { ClockService } from '../../services/clock.service';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public user: User = new User();
  public logo: any;
  public time: Date;
  public position: any;
  public allowLocation = false;
  public backgroundColor = '';
  public theme = '';
  public activeSession: TimeControl = null;
  public activeBreakSession: TimeControl = null;
  public address = '';
  public reverseGeocoder: any;
  public parameters: any = null;
  public timerGoing = false;
  public sessionTime: string;
  public sessionDone = false;
  private clockSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
    private datepipe: DatePipe,
    private router: Router,
    private parameterService: ParameterService,
    private configService: ConfigService,
    private helperService: HelperService,
    private nativeGeocoder: NativeGeocoder,
    private timecontrolService: TimeControlService,
    private popoverCtrl: PopoverController,
    private clockService: ClockService,
    private modalCtrl: ModalController) {

    this.clockSubscription = this.clockService.getClock().subscribe((time) => {
      this.time = time;
      this.sessionTime = this.timeInSession();
    });
  }

  async ngOnInit() {
    this.user = await this.authService.getUser();
    this.logo = await this.configService.getLogo();
    this.parameters = await this.parameterService.get();
    if (this.parameters){
      this.backgroundColor = this.parameters.navbarBackgroundColor;
      if (this.parameters.navbarColorClass === 'navbar-light'){
        this.theme = 'white';
      }
      else{
        this.theme = 'black';
      }
    }
    await this.getCurrentLocation();
  }

  ngOnDestroy() {
    this.clockSubscription.unsubscribe();
  }

  logout() {
    try {
      this.authService.logout();
    }
    catch (error) {
      console.log('LOGOUT ERROR', error);
      return;
    }

    this.router.navigate(['/login']);
  }

  async getCurrentLocation() {
    // check permission
    if (this.parameters) {
      if (this.parameters.geolocation) {
        this.allowLocation = await this.helperService.getLocationPermissions();

        if (this.allowLocation) {
          this.position = await this.helperService.getLocation();
        }
      }
    }

    // Get address
    const options = {
      useLocale: true,
      maxResults: 3
    };
    if (this.position) {
      this.reverseGeocoder = await this.nativeGeocoder.reverseGeocode(this.position.coords.latitude,
        this.position.coords.longitude, options);
      this.address = this.reverseGeocoder[0].locality + ', ' +
        this.reverseGeocoder[0].administrativeArea + ', ' + this.reverseGeocoder[0].countryCode;
    }
  }

  async startTimer() {
    // check if he/she has an absence on this day
    let ausencia: any;
    try {
      ausencia = await this.timecontrolService.isInAbsence(this.user.userName);
    }
    catch (error) {
      console.log('ERROR AL OBTENER AUSENCIA', error);
      return;
    }

    if (ausencia.flag === 'true') {
      this.presentPopoverAusencia();
      return;
    }

    this.timerGoing = true;
    // Create new session
    this.activeSession = new TimeControl();
    this.activeSession.userName = this.user.userName;
    this.activeSession.company = this.user.company;
    this.activeSession.startDate = this.datepipe.transform(this.time, 'YYYY-MM-dd HH:mm');

    //Set activesession location values
    await this.getCurrentLocation();

    this.activeSession.startLongitude = this.position.coords.longitude;
    this.activeSession.startLatitude = this.position.coords.latitude;
    this.activeSession.startAltitude = this.position.coords.altitude;
    this.activeSession.startHorizontalAccuracy = this.position.coords.accuracy;
    this.activeSession.startVerticalAccuracy = this.position.coords.accuracy;
    this.activeSession.startSpeed = this.position.coords.speed;

    //Set activessesion address values
    this.activeSession.startAddress = this.address;
    this.activeSession.startCity = this.reverseGeocoder[0].locality;
    this.activeSession.startCountry = this.reverseGeocoder[0].countryName;
    // Parte de la ciudad
    this.activeSession.startDistrict = this.reverseGeocoder[0].subLocality;
    // Provincia
    this.activeSession.startCounty = this.reverseGeocoder[0].subAdministrativeArea;
    this.activeSession.startHouseNumber = this.reverseGeocoder[0].subThoroughfare;
    this.activeSession.startPostalCode = this.reverseGeocoder[0].postalCode;
    this.activeSession.startStreet = this.reverseGeocoder[0].thoroughfare;
    // Comunidad autonoma
    this.activeSession.startState = this.reverseGeocoder[0].administrativeArea;

    //Save session
    try {
      await this.timecontrolService.createSession(this.activeSession);
      this.getActiveSession();
    }
    catch (error) {
      console.log('ERROR AL GUARDAR LA SESION', error);
      this.activeSession = null;
      this.timerGoing = false;
      this.sessionTime = '';
    }
  }

  async endTimer() {

    this.timerGoing = false;

    //Get session if exists
    await this.getActiveSession();
    await this.getActiveBreakSession();

    //Set activesession location values
    await this.getCurrentLocation();

    //Check if there is an active session
    if (!this.activeSession) {
      console.log('NO ACTIVE SESSION ON END TIMER', JSON.stringify(this.activeSession));
      return;
    }

    //Close break session
    if (this.activeBreakSession) {
      try {
        await this.endBreakTimer();
      }
      catch (error) {
        console.log('ERROR CLOSING BREAK SESSION', error);
      }
    }

    // End time
    this.activeSession.endDate = this.datepipe.transform(this.time, 'YYYY-MM-dd HH:mm');

    this.activeSession.endLongitude = this.position.coords.longitude;
    this.activeSession.endLatitude = this.position.coords.latitude;
    this.activeSession.endAltitude = this.position.coords.altitude;
    this.activeSession.endHorizontalAccuracy = this.position.coords.accuracy;
    this.activeSession.endVerticalAccuracy = this.position.coords.accuracy;
    this.activeSession.endSpeed = this.position.coords.speed;

    //Set activessesion address values
    this.activeSession.endAddress = this.address;
    this.activeSession.endCity = this.reverseGeocoder[0].locality;
    this.activeSession.endCountry = this.reverseGeocoder[0].countryName;
    // Parte de la ciudad
    this.activeSession.endDistrict = this.reverseGeocoder[0].subLocality;
    // Provincia
    this.activeSession.endCounty = this.reverseGeocoder[0].subAdministrativeArea;
    this.activeSession.endHouseNumber = this.reverseGeocoder[0].subThoroughfare;
    this.activeSession.endPostalCode = this.reverseGeocoder[0].postalCode;
    this.activeSession.endStreet = this.reverseGeocoder[0].thoroughfare;
    // Comunidad autonoma
    this.activeSession.endState = this.reverseGeocoder[0].administrativeArea;

    // Save end session
    try {
      await this.timecontrolService.putSession(this.activeSession);
      this.activeSession = null;
      this.activeBreakSession = null;
      this.sessionTime = '';
      this.sessionDone = true;
    }
    catch (error) {
      console.log('ERROR AL TERMINAR SESION', error);
    }
  }

  async startBreakTimer() {

    // Create new session
    this.activeBreakSession = new TimeControl();
    this.activeBreakSession.userName = this.user.userName;
    this.activeBreakSession.company = this.user.company;
    this.activeBreakSession.startDate = this.datepipe.transform(this.time, 'YYYY-MM-dd HH:mm');
    this.activeBreakSession.break = true;

    //Set activesession location values
    await this.getCurrentLocation();

    this.activeBreakSession.startLongitude = this.position.coords.longitude;
    this.activeBreakSession.startLatitude = this.position.coords.latitude;
    this.activeBreakSession.startAltitude = this.position.coords.altitude;
    this.activeBreakSession.startHorizontalAccuracy = this.position.coords.accuracy;
    this.activeBreakSession.startVerticalAccuracy = this.position.coords.accuracy;
    this.activeBreakSession.startSpeed = this.position.coords.speed;

    //Set activessesion address values
    this.activeBreakSession.startAddress = this.address;
    this.activeBreakSession.startCity = this.reverseGeocoder[0].locality;
    this.activeBreakSession.startCountry = this.reverseGeocoder[0].countryName;
    // Parte de la ciudad
    this.activeBreakSession.startDistrict = this.reverseGeocoder[0].subLocality;
    // Provincia
    this.activeBreakSession.startCounty = this.reverseGeocoder[0].subAdministrativeArea;
    this.activeBreakSession.startHouseNumber = this.reverseGeocoder[0].subThoroughfare;
    this.activeBreakSession.startPostalCode = this.reverseGeocoder[0].postalCode;
    this.activeBreakSession.startStreet = this.reverseGeocoder[0].thoroughfare;
    // Comunidad autonoma
    this.activeBreakSession.startState = this.reverseGeocoder[0].administrativeArea;

    //Save break session
    try {
      await this.timecontrolService.createSession(this.activeBreakSession);
      this.getActiveBreakSession();
    }
    catch (error) {
      console.log('ERROR AL GUARDAR LA SESION', error);
      this.activeSession = null;
      this.timerGoing = false;
      this.sessionTime = '';
    }
  }

  async endBreakTimer() {

    //Get active session
    await this.getActiveBreakSession();

    //Check if active break session exists
    if (!this.activeBreakSession) {
      console.log('NO ACTIVE BREAK ON END BREAK', JSON.stringify(this.activeBreakSession));
    }

    // Set datime end session
    this.activeBreakSession.endDate = this.datepipe.transform(this.time, 'YYYY-MM-dd HH:mm');

    // Set location values
    await this.getCurrentLocation();

    this.activeBreakSession.endLongitude = this.position.coords.longitude;
    this.activeBreakSession.endLatitude = this.position.coords.latitude;
    this.activeBreakSession.endAltitude = this.position.coords.altitude;
    this.activeBreakSession.endHorizontalAccuracy = this.position.coords.accuracy;
    this.activeBreakSession.endVerticalAccuracy = this.position.coords.accuracy;
    this.activeBreakSession.endSpeed = this.position.coords.speed;

    //Set activebreakssesion address values
    this.activeBreakSession.endAddress = this.address;
    this.activeBreakSession.endCity = this.reverseGeocoder[0].locality;
    this.activeBreakSession.endCountry = this.reverseGeocoder[0].countryName;
    // Parte de la ciudad
    this.activeBreakSession.endDistrict = this.reverseGeocoder[0].subLocality;
    // Provincia
    this.activeBreakSession.endCounty = this.reverseGeocoder[0].subAdministrativeArea;
    this.activeBreakSession.endHouseNumber = this.reverseGeocoder[0].subThoroughfare;
    this.activeBreakSession.endPostalCode = this.reverseGeocoder[0].postalCode;
    this.activeBreakSession.endStreet = this.reverseGeocoder[0].thoroughfare;
    // Comunidad autonoma
    this.activeBreakSession.endState = this.reverseGeocoder[0].administrativeArea;

    // Save end session
    try {
      await this.timecontrolService.putSession(this.activeBreakSession);
      this.activeBreakSession = null;
    }
    catch (error) {
      console.log('ERROR AL TERMINAR BREAK', error);
    }

  }

  public async presentAbsenceDashboard(){
    const modal = await this.modalCtrl.create({
      component: ModalAbsencesPage,
      backdropDismiss: false,
      animated: true
    });
    await modal.present();
  }

  public async presentSessionReportDashboard(){
    const modal = await this.modalCtrl.create({
      component: ModalSessionReportPage,
      backdropDismiss: false,
      animated: true
    });
    await modal.present();
  }

  private async presentPopoverAusencia() {
    const popover = await this.popoverCtrl.create({
      component: PopoverAbsenceComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true
    });
    await popover.present();
  }

  private timeInSession(): string {
    const startTimeDate: Date = new Date(this.activeSession?.startDate);
    const endTimeDate: Date = new Date();

    const diff = endTimeDate.getTime() - startTimeDate.getTime();
    const daysDiff = Math.floor(diff / (60 * 60 * 24 * 1000));
    const hoursDiff = Math.floor(diff / (60 * 60 * 1000)) - (daysDiff * 24);
    const minsDiff = Math.floor(diff / (60 * 1000)) - ((daysDiff * 24 * 60) + (hoursDiff * 60));

    const returnStr = `${hoursDiff} HORA(S) ${minsDiff} MINUTO(S)`;

    return returnStr;
  }

  private async getActiveSession() {
    try {
      this.activeSession = await this.timecontrolService.getActiveSession(this.user.userName);
      if (this.activeSession) {
        this.address = this.activeSession.startAddress;
      }
    }
    catch (error) {
      console.log('ERROR GET ACTIVE SESSION', error);
    }
  }

  private async getActiveBreakSession() {
    try {
      this.activeBreakSession = await this.timecontrolService.getActiveSession(this.user.userName, true);
    }
    catch (error) {
      console.log('ERROR GET ACTIVE BREAK SESSION', error);
    }
  }
}
