// Angular
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// Ionic
import { ModalController, PopoverController } from '@ionic/angular';

// Models
import { User } from '../../models/user.model';
import { Absence } from '../../models/absence.model';

// Components
import { PopoverAbsenceExistsComponent } from 'src/app/components/popover-absence-exists/popover-absence-exists.component';
import { AbsenceErrorComponent } from 'src/app/components/absence-error/absence-error.component';
import { AbsenceCreatedComponent } from 'src/app/components/absence-created/absence-created.component';

// Services
import { AbsenseService } from 'src/app/services/absense.service';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-modal-absences',
  templateUrl: './modal-absences.page.html',
  styleUrls: ['./modal-absences.page.scss'],
})
export class ModalAbsencesPage implements OnInit {

  public user: User = new User();
  public ausencia: Absence = new Absence();
  public years: number[] = [new Date().getFullYear(), new Date().getFullYear() + 1];
  public allAbsences: Absence[] = [];
  public logo: any;

  constructor(private modalCtrl: ModalController,
              private authService: AuthService,
              private absenceService: AbsenseService,
              private popoverCtrl: PopoverController,
              private configService: ConfigService,
              private datepipe: DatePipe) { }

  async ngOnInit() {
    this.user = await this.authService.getUser();
    this.logo = await this.configService.getLogo();
    this.getAbsences();
  }

  public dismiss(){
    this.modalCtrl.dismiss();
  }

  public async createAbsence(){

    //set absence values that are not in form
    this.ausencia.id = 0;
    this.ausencia.userName = this.user.userName;
    this.ausencia.company = this.user.company;
    this.ausencia.approved = false;

    try{
      const response = await this.absenceService.create(this.ausencia);
      console.log('RESPONSE ABSENCE', JSON.stringify(response));
      if (response.status && response.status === 409) {
        this.absenceAlreadyExistsPopover();
        return;
      }

      this.absenceCreatedPopover();
      this.dismiss();
    }
    catch(error){
      console.log('ERROR AL CREAR AUSENCIA', error);
      if (error.message === 'JSONException'){
        this.absenceErrorPopover();
        return;
      }
    }
  }

  private async getAbsences(){
    // Get today date but +- 1 year
    const startDate = this.datepipe.transform( new Date()
        .setFullYear( new Date().getFullYear() - 1), 'YYYY-MM-dd');
    const endDate = this.datepipe.transform( new Date()
    .setFullYear( new Date().getFullYear() + 1), 'YYYY-MM-dd');

    try{
      this.allAbsences = await this.absenceService.getAbsences(startDate, endDate, this.user.company, this.user.userName);
    }
    catch(error){
      console.log('ERROR GETTING ABSENCES', error);
      return;
    }
  }

  private async absenceAlreadyExistsPopover() {
    const popover = await this.popoverCtrl.create({
      component: PopoverAbsenceExistsComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true
    });
    await popover.present();
  }

  private async absenceErrorPopover() {
    const popover = await this.popoverCtrl.create({
      component: AbsenceErrorComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true
    });
    await popover.present();
  }

  private async absenceCreatedPopover() {
    const popover = await this.popoverCtrl.create({
      component: AbsenceCreatedComponent,
      translucent: true,
      backdropDismiss: true,
      animated: true
    });
    await popover.present();
  }
}
