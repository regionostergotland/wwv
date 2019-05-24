import { NgModule } from '@angular/core';
import { PlatformSelectionComponent } from './platform-selection/platform-selection.component';
import { CommonModule } from '@angular/common';
import { CategorySelectionComponent } from './category-selection/category-selection.component';

import { InspectionViewComponent } from './inspection-view/inspection-view.component';
import {
  BottomSheetCategoriesComponent,
  EditorViewComponent,
} from './editor-view/editor-view.component';
import { DataViewerModule } from './data-viewer/data-viewer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddNewDataModalComponent } from './editor-view/add-new-data-modal.component';

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


@NgModule({
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
  ],
  declarations: [
    PlatformSelectionComponent,
    CategorySelectionComponent,
    InspectionViewComponent,
    EditorViewComponent,
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent,
  ],
  exports: [PlatformSelectionComponent],
  entryComponents: [
    BottomSheetCategoriesComponent,
    AddNewDataModalComponent,
  ],
})
export class MainModule {}
