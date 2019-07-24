import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { MAT_DATE_LOCALE } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';

/* Main component */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './gui/login/login.component';

/* Page / view components */
import { InfoPageComponent } from './gui/info-page/info-page.component';
import { HomePageComponent } from './gui/home-page/home-page.component';
import { HelpPageComponent } from './gui/help-page/help-page.component';

/* Fetching */
import {
  PlatformSelectionComponent
} from './gui/platform-selection/platform-selection.component';
import {
  CategorySelectionComponent
} from './gui/category-selection/category-selection.component';

/* Editing */
import {
  EditorViewComponent,
} from './gui/editor-view/editor-view.component';
import {
  AddNewDataModalComponent
} from './gui/editor-view/add-new-data-modal.component';
import {
  BottomSheetCategoriesComponent
} from './gui/editor-view/bottom-sheet-categories.component';

/* Inspection */
import {
  InspectionViewComponent
} from './gui/inspection-view/inspection-view.component';

/* Common components */
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';

/* Static components */
import {
  ProgressBarComponent
} from './gui/progress-bar/progress-bar.component';
import { FooterComponent } from './gui/footer/footer.component';
import { ToolbarComponent } from './gui/toolbar/toolbar.component';

/* Google Fit configuration */
import { CustomGoogleApiModule } from './google-fit-config';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    /* pages */
    HomePageComponent,
    InfoPageComponent,
    HelpPageComponent,
    /* static components */
    ProgressBarComponent,
    FooterComponent,
    ToolbarComponent,
    /* views */
    PlatformSelectionComponent,
    CategorySelectionComponent,
    EditorViewComponent,
    InspectionViewComponent,
    /* editor view components */
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
    AppRoutingModule,
    HttpClientModule,
    CustomGoogleApiModule,
    DataViewerModule,
  ],
  entryComponents: [
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
