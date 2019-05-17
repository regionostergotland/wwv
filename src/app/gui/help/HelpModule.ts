import { NgModule } from '@angular/core';
import { HelpComponent } from './help.component';

import {
    MatCardModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
  ],
  declarations: [
    HelpComponent
  ],
  exports: [ HelpComponent ],
  entryComponents: [ HelpComponent ]
})
export class HelpModule {}
