import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
    MatCardModule,
    MatButtonModule
} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterModule,
    FlexLayoutModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [ HomeComponent ],
  entryComponents: [ HomeComponent ]
})
export class HomeModule {}
