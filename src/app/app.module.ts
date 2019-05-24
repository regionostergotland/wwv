import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

/* Main component */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/* Page / view components */
import { InfoPageComponent } from './gui/info-page/info-page.component';
import { HomePageComponent } from './gui/home-page/home-page.component';
import { HelpModule } from './gui/help-page/HelpModule';
import {
  PlatformSelectionComponent
} from './gui/platform-selection/platform-selection.component';
import {
  CategorySelectionComponent
} from './gui/category-selection/category-selection.component';
import {
  BottomSheetCategoriesComponent,
  EditorViewComponent,
} from './gui/editor-view/editor-view.component';
import {
  InspectionViewComponent
} from './gui/inspection-view/inspection-view.component';

/* Static components */
import { ProgressBarComponent } from './gui/progress-bar/progress-bar.component';
import { FooterComponent } from './gui/footer/footer.component';
import { ToolbarComponent } from './gui/toolbar/toolbar.component';

import {
  MAT_DATE_LOCALE
} from '@angular/material';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataViewerModule } from './gui/data-viewer/data-viewer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddNewDataModalComponent } from './gui/editor-view/add-new-data-modal.component';

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
    HomePageComponent,
    InfoPageComponent,
    ProgressBarComponent,
    FooterComponent,
    PlatformSelectionComponent,
    CategorySelectionComponent,
    InspectionViewComponent,
    EditorViewComponent,
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent,
    ToolbarComponent,
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
    AppRoutingModule,
    HelpModule,
    HttpClientModule,
    CustomGoogleApiModule,
    DataViewerModule,
  ],
  entryComponents: [
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'sv-SE'}],
  bootstrap: [AppComponent],
})
export class AppModule { }
