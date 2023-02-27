import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PopoverErrorLoginComponent } from './popover-error-login/popover-error-login.component';
import { PopoverAbsenceComponent } from './popover-absence/popover-absence.component';
import { PopoverAbsenceExistsComponent } from './popover-absence-exists/popover-absence-exists.component';
import { AbsenceErrorComponent } from './absence-error/absence-error.component';
import { AbsenceCreatedComponent } from './absence-created/absence-created.component';



@NgModule({
  declarations: [
    PopoverErrorLoginComponent,
    PopoverAbsenceComponent,
    PopoverAbsenceExistsComponent,
    AbsenceErrorComponent,
    AbsenceCreatedComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PopoverErrorLoginComponent,
    PopoverAbsenceComponent,
    PopoverAbsenceExistsComponent,
    AbsenceErrorComponent,
    AbsenceCreatedComponent
  ]
})
export class ComponentsModule { }
