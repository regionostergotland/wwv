import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SourcesComponent } from './gui/sources/sources.component';
import { HomeComponent } from './gui/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoryPickerComponent } from './gui/category-picker/category-picker.component';
import { InfoComponent } from './gui/info/info.component';
import { HelpComponent } from './gui/help/help.component';
import { HealthListItemsComponent, RemovalDialogComponent, MathDialogComponent } from './gui/health-list-items/health-list-items.component';
import { InspectionComponent } from './gui/inspection/inspection.component';
import { BottomSheetCategoriesComponent, SidebarComponent } from './gui/sidebar/sidebar.component';
import { AddDataPointComponent } from './gui/add-data-point/add-data-point.component';
import { ProgressBarComponent } from './gui/progress-bar/progress-bar.component';
import { ConfirmationComponent } from './gui/confirmation/confirmation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker';



import { ToolbarComponent } from './gui/toolbar/toolbar.component';
import { ToolbarModule } from './gui/toolbar/ToolbarModule';


import { HomeModule } from './gui/home/HomeModule'
import {
  MatButtonModule,
  /*MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
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
  MatFormFieldModule,*/
  MAT_DATE_LOCALE
} from '@angular/material';


import { CustomGoogleApiModule } from './google-fit-config';
import { FooterModule } from './gui/footer/FooterModule';


@NgModule({
  declarations: [
    AppComponent,
    /*ToolbarComponent,
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
    FooterComponent,*/
  ],
  imports: [
    BrowserModule,
    HomeModule,
    ToolbarModule,
    AppRoutingModule,
    FooterModule,
    /*FormsModule,
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
    AppRoutingModule,*/
    HttpClientModule,
    CustomGoogleApiModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'sv-SE'}],
  bootstrap: [AppComponent],
  entryComponents: [ /*AddDataPointComponent, BottomSheetCategoriesComponent, RemovalDialogComponent, MathDialogComponent*/]
})
export class AppModule { }
