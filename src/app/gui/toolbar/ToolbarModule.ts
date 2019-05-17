import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';

import {
    MatToolbarModule,
    MatButtonModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule
  ],
  declarations: [
    ToolbarComponent
  ],
  exports: [ ToolbarComponent ],
  entryComponents: [ ToolbarComponent ]
})
export class ToolbarModule {}
