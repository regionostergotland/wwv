import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToolbarModule } from './gui/toolbar/ToolbarModule';
import { MainModule } from './gui/MainModule';
import { HelpModule } from './gui/help/HelpModule';
import { HomeModule } from './gui/home/HomeModule';
import { MAT_DATE_LOCALE } from '@angular/material';
import { CustomGoogleApiModule } from './google-fit-config';
import { FooterModule } from './gui/footer/FooterModule';
import { InfoComponent } from './gui/info/info.component';
import { ProgressBarComponent } from './gui/progress-bar/progress-bar.component';

import { MatProgressBarModule, MatGridListModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    ProgressBarComponent
  ],
  imports: [
    MatProgressBarModule,
    MatButtonModule,
    MatGridListModule,
    BrowserModule,
    HomeModule,
    ToolbarModule,
    AppRoutingModule,
    FooterModule,
    HelpModule,
    MainModule,
    HttpClientModule,
    CustomGoogleApiModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'sv-SE'}],
  bootstrap: [AppComponent],
})
export class AppModule { }
