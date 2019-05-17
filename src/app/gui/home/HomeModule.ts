import { NgModule }      from '@angular/core';
import { HomeComponent } from './home.component';
 
@NgModule({
  imports: [
    //BrowserModule,
  ],
  declarations: [
    HomeComponent
  ],
  exports: [ HomeComponent ],
  entryComponents: [ HomeComponent ]
})
export class AppModule {}