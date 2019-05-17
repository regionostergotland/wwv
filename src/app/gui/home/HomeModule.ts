import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';

import {
    MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
  ],
  declarations: [
    HomeComponent
  ],
  exports: [ HomeComponent ],
  entryComponents: [ HomeComponent ]
})
export class HomeModule {}
