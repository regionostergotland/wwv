import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataPoint, Filter, filterString } from 'src/app/ehr/datalist';
import { Conveyor } from 'src/app/conveyor.service';

import { DataPointDialogComponent } from '../data-point-dialog/data-point-dialog.component';
import { MathFunctionEnum, mathFunctionString,
         CategorySpec } from 'src/app/ehr/datatype';
import { PeriodWidth, periodString } from 'src/app/shared/period';

import { DataFilterDialogComponent } from '../data-filter-dialog/data-filter-dialog.component';
import { DataRemovalDialogComponent } from '../data-removal-dialog/data-removal-dialog.component';



@Component({
  selector: 'app-data-container',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss']
})
export class DataContainerComponent implements OnInit {
  PeriodWidth = PeriodWidth;
  filterString = filterString;

  @Input() editable: boolean;

  @Input() set selectCategory(value: string) {
    if (this.selectedCategory) {
      this.selectedCategory = value;
      this.ngOnInit();
    } else {
      this.selectedCategory = value;
    }
  }

  categorySpec: CategorySpec;
  selectedCategory: string;
  dataList: Map<Filter, MatTableDataSource<DataPoint>>;
  selectedRows: DataPoint[];
  chartEntries: Map<Filter, DataPoint[]>;

  constructor(private conveyor: Conveyor, public dialog: MatDialog) { }

  ngOnInit() {
    this.selectedRows = [];
    this.dataList = new Map<Filter, MatTableDataSource<DataPoint>>();
    // Needs to be a new map for the graph to update
    this.chartEntries = new Map(this.conveyor.getDataList(this.selectedCategory).getPoints());
    for (const [filter, points] of this.conveyor.getDataList(this.selectedCategory).getPoints().entries()) {
      this.dataList.set(filter, new MatTableDataSource<DataPoint>(points));
    }

    this.categorySpec = this.conveyor.getCategorySpec(this.selectedCategory);
  }

  updateSelected(event) {
    this.selectedRows = event;
  }

  /**
   * Opens the dialog to add an item in the list stored in the conveyor.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DataPointDialogComponent, {
      data: { category: this.selectedCategory }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  /**
   * Opens the dialog for MathDialogComponent
   */
  openMathDialog(): void {
    // this.selection.clear();
    const dialogRef = this.dialog.open(DataFilterDialogComponent, {
      data: this.selectedCategory
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openRemovalDialog() {
    if (this.selectedRows.length > 0) {
      const dialogRef = this.dialog.open(DataRemovalDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // If result is true, that means the user pressed the button for removing selected values
        if (result) {
          this.removeSelected();
        }
      });
    }
  }

  /**
   * Removes all of the selected datapoints and updates the list
   */
  removeSelected() {
    this.conveyor.getDataList(this.selectedCategory)
      .removePoints(this.selectedRows);
    this.ngOnInit();
  }

  removeFilter(filter: Filter): void {
    const dataList = this.conveyor.getDataList(this.selectedCategory);
    dataList.removeFilter(filter);
    this.ngOnInit();
  }

  isSmallScreen(): boolean {
    return window.matchMedia('(max-width: 599px)').matches;
  }
}
