import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page.component';
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
    HomePageComponent
  ],
  exports: [ HomePageComponent ],
  entryComponents: [ HomePageComponent ]
})
export class HomeModule {}
