import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAbsencesPageRoutingModule } from './modal-absences-routing.module';

import { ModalAbsencesPage } from './modal-absences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAbsencesPageRoutingModule
  ],
  declarations: [ModalAbsencesPage]
})
export class ModalAbsencesPageModule {}
