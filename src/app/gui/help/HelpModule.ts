import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';

import {
    MatToolbarModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
  ],
  declarations: [
    FooterComponent
  ],
  exports: [ FooterComponent ],
  entryComponents: [ FooterComponent ]
})
export class FooterModule {}
