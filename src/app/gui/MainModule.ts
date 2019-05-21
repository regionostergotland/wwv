import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { CommonModule } from '@angular/common';
import { CategoryPickerComponent } from './category-picker/category-picker.component';
import {
  HealthListItemsComponent,
} from './health-list-items/health-list-items.component';
import { EditorComponent,
         MathDialogComponent,
         RemovalDialogComponent } from './editor/editor.component';
import { InspectionComponent } from './inspection/inspection.component';
import {
  BottomSheetCategoriesComponent,
  SidebarComponent,
} from './sidebar/sidebar.component';
import { AddDataPointComponent } from './add-data-point/add-data-point.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddNewDataModalComponent } from './sidebar/add-new-data-modal.component';

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

/*
   ,
*/
@NgModule({
  imports: [
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
    SourcesComponent,
    CategoryPickerComponent,
    InspectionComponent,
    SidebarComponent,
    AddDataPointComponent,
    BottomSheetCategoriesComponent,
    HealthListItemsComponent,
    RemovalDialogComponent,
    EditorComponent,
    MathDialogComponent,
    AddNewDataModalComponent,
  ],
  exports: [SourcesComponent],
  entryComponents: [
    HealthListItemsComponent,
    AddDataPointComponent,
    BottomSheetCategoriesComponent,
    RemovalDialogComponent,
    MathDialogComponent,
    AddNewDataModalComponent,
  ],
})
export class MainModule {}
