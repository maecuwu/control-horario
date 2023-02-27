import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAbsencesPage } from './modal-absences.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAbsencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAbsencesPageRoutingModule {}
