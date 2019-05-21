import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToolbarModule } from './gui/toolbar/ToolbarModule';
import { MainModule } from './gui/MainModule';
import { HelpModule } from './gui/help/HelpModule';
import { HomeModule } from './gui/home/HomeModule';
import { FooterModule } from './gui/footer/FooterModule';
import { InfoComponent } from './gui/info/info.component';
import { ProgressBarComponent } from './gui/progress-bar/progress-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,
  MAT_DATE_LOCALE
} from '@angular/material';

import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from './google-fit-config';
import { FooterComponent } from './gui/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    ProgressBarComponent,
  ],
  imports: [
    MatCardModule,
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
