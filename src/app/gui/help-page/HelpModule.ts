import { NgModule } from '@angular/core';
import { HelpPageComponent } from './help-page.component';

import {
    MatCardModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
  ],
  declarations: [
    HelpPageComponent
  ],
  exports: [ HelpPageComponent ],
  entryComponents: [ HelpPageComponent ]
})
export class HelpModule {}
