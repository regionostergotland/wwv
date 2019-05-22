import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatTooltipModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    FlexLayoutModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    ToolbarComponent
  ],
  exports: [ ToolbarComponent ],
  entryComponents: [ ToolbarComponent ]
})
export class ToolbarModule {}
