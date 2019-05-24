import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CustomGoogleApiModule } from 'src/app/google-fit-config';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
import { AmazingTimePickerModule } from 'amazing-time-picker';

import {
    DataTableComponent,
} from './data-table/data-table.component';
import {
  DataContainerComponent
} from './data-container/data-container.component';
import {
  DataFilterDialogComponent
} from './data-filter-dialog/data-filter-dialog.component';
import {
  DataRemovalDialogComponent
} from './data-removal-dialog/data-removal-dialog.component';
import { DataChartComponent } from './data-chart/data-chart.component';
import {
  DataPointDialogComponent
} from './data-point-dialog/data-point-dialog.component';

@NgModule({
  imports: [
    NgxChartsModule,
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
    HttpClientModule,
    CustomGoogleApiModule,
  ],
  declarations: [
    DataChartComponent,
    DataPointDialogComponent,
    DataTableComponent,
    DataFilterDialogComponent,
    DataContainerComponent,
    DataRemovalDialogComponent,
  ],
  exports: [DataContainerComponent],
  entryComponents: [
    DataTableComponent,
    DataContainerComponent,
    DataPointDialogComponent,
    DataFilterDialogComponent,
    DataRemovalDialogComponent,
  ],

  providers: [
      {provide: MatDialogRef, useValue: {}},
      { provide: MAT_DIALOG_DATA, useValue: {} }, ]
})
export class DataViewerModule {}
