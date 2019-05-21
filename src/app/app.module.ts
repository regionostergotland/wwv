import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './gui/toolbar/toolbar.component';
import { SourcesComponent } from './gui/sources/sources.component';
import { HomeComponent } from './gui/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoryPickerComponent } from './gui/category-picker/category-picker.component';
import { InfoComponent } from './gui/info/info.component';
import { HelpComponent } from './gui/help/help.component';
import { HealthListItemsComponent} from './gui/health-list-items/health-list-items.component';
import { InspectionComponent } from './gui/inspection/inspection.component';
import { BottomSheetCategoriesComponent, SidebarComponent } from './gui/sidebar/sidebar.component';
import { AddDataPointComponent } from './gui/add-data-point/add-data-point.component';
import { ProgressBarComponent } from './gui/progress-bar/progress-bar.component';
import { ConfirmationComponent } from './gui/confirmation/confirmation.component';
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
import { EditorComponent, MathDialogComponent, RemovalDialogComponent } from './gui/editor/editor.component';



@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    HomeComponent,
    SourcesComponent,
    CategoryPickerComponent,
    InfoComponent,
    HelpComponent,
    HealthListItemsComponent,
    InspectionComponent,
    SidebarComponent,
    AddDataPointComponent,
    BottomSheetCategoriesComponent,
    RemovalDialogComponent,
    MathDialogComponent,
    ProgressBarComponent,
    ConfirmationComponent,
    FooterComponent,
    EditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

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
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatFormFieldModule,
    MatTableModule,

    AmazingTimePickerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CustomGoogleApiModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'sv-SE'}],
  bootstrap: [AppComponent],
  entryComponents: [AddDataPointComponent, BottomSheetCategoriesComponent, RemovalDialogComponent, MathDialogComponent]
})
export class AppModule { }
