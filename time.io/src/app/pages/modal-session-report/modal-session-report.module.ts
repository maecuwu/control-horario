import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalSessionReportPageRoutingModule } from './modal-session-report-routing.module';

import { ModalSessionReportPage } from './modal-session-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSessionReportPageRoutingModule
  ],
  declarations: [ModalSessionReportPage]
})
export class ModalSessionReportPageModule {}
