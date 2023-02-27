import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalSessionReportPage } from './modal-session-report.page';

const routes: Routes = [
  {
    path: '',
    component: ModalSessionReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSessionReportPageRoutingModule {}
