import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToolbarModule } from './gui/toolbar/ToolbarModule';
import { HelpModule } from './gui/help/HelpModule';
import { HomeModule } from './gui/home/HomeModule';
import { InfoComponent } from './gui/info/info.component';
import { ProgressBarComponent } from './gui/progress-bar/progress-bar.component';

import { FooterComponent } from './gui/footer/footer.component';

import {
  MAT_DATE_LOCALE
} from '@angular/material';

import { NgModule } from '@angular/core';
import { SourcesComponent } from './gui/sources/sources.component';
import { CommonModule } from '@angular/common';
import { CategoryPickerComponent } from './gui/category-selection/category-selection.component';

import { InspectionComponent } from './gui/inspection/inspection.component';
import {
  BottomSheetCategoriesComponent,
  SidebarComponent,
} from './gui/sidebar/sidebar.component';
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddNewDataModalComponent } from './gui/sidebar/add-new-data-modal.component';

import {
  MatCardModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
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
  MatExpansionModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,
  MatTableModule,
} from '@angular/material';


import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from './google-fit-config';


@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    ProgressBarComponent,
    FooterComponent,
    SourcesComponent,
    CategoryPickerComponent,
    InspectionComponent,
    SidebarComponent,
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent,
  ],
  imports: [
    DataViewerModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    FormsModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserAnimationsModule,
    AmazingTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
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
    MatExpansionModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatFormFieldModule,
    MatTableModule,
    AmazingTimePickerModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatGridListModule,
    BrowserModule,
    HomeModule,
    ToolbarModule,
    AppRoutingModule,
    HelpModule,
    HttpClientModule,
    CustomGoogleApiModule,
    DataViewerModule
  ],
  entryComponents: [ BottomSheetCategoriesComponent,
    AddNewDataModalComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'sv-SE'}],
  bootstrap: [AppComponent],
})
export class AppModule { }
