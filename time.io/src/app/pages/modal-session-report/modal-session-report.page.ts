import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { TimeControlService } from 'src/app/services/time-control.service';

@Component({
  selector: 'app-modal-session-report',
  templateUrl: './modal-session-report.page.html',
  styleUrls: ['./modal-session-report.page.scss'],
})
export class ModalSessionReportPage implements OnInit {

  public user = new User();
  public dailyReport: any = null;
  public backgroundColor = '';
  public theme = '';
  public logo: any;
  public toDate: string = this.datePipe.transform( new Date().setMonth(
    new Date().getMonth() - 6), 'YYYY-MM-dd');

  constructor(private modalCtrl: ModalController,
              private timecontrolService: TimeControlService,
              private authService: AuthService,
              private datePipe: DatePipe,
              private parameterService: ParameterService,
              private configService: ConfigService) { }

  async ngOnInit() {
    this.user = await this.authService.getUser();
    const parameters = await this.parameterService.get();
    if (parameters){
      this.backgroundColor = parameters.navbarBackgroundColor;
      if (parameters.navbarColorClass === 'navbar-light'){
        this.theme = 'white';
      }
      else{
        this.theme = 'black';
      }
    }
    this.getDailyReport();
    this.logo = await this.configService.getLogo();
  }

  public dismiss(){
    this.modalCtrl.dismiss();
  }

  public async getDailyReport(){
    const toDate: string = this.datePipe.transform( new Date(), 'YYYY-MM-dd');
    // 6 months
    try {
      this.dailyReport = await this.timecontrolService.getDailyReport(this.user.company,
        this.user.userName, this.toDate, toDate);
    }
    catch (error) {
      console.log('ERROR GETTING DAILY REPORT', error);
      return;
    }
  }

}
