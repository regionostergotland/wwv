import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource,
         MatDialog } from '@angular/material';

import { Conveyor } from 'src/app/conveyor.service';
import {
  DataPointDialogComponent
} from '../data-point-dialog/data-point-dialog.component';
import {
         CategorySpec } from 'src/app/ehr/datatype';
import { PeriodWidth } from 'src/app/shared/period';
import { DataPoint, Filter, filterString } from 'src/app/ehr/datalist';
import {
  DataFilterDialogComponent
} from '../data-filter-dialog/data-filter-dialog.component';
import {
  DataRemovalDialogComponent
} from '../data-removal-dialog/data-removal-dialog.component';
import {SelectionModel} from '@angular/cdk/collections';

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
  selectedRows: SelectionModel<DataPoint> = new SelectionModel<DataPoint>();
  selectedRowsLength: number;
  chartEntries: Map<Filter, DataPoint[]>;

  constructor(private conveyor: Conveyor, public dialog: MatDialog) { }

  ngOnInit() {
    this.selectedRowsLength = 0;
    if (this.selectedRows) {
      this.selectedRows.clear();
    }
    this.dataList = new Map<Filter, MatTableDataSource<DataPoint>>();
    // Needs to be a new map for the graph to update
    if (this.selectedCategory) {
      this.chartEntries = new Map(
        this.conveyor.getDataList(this.selectedCategory).getPoints()
      );
      const pts =
        this.conveyor.getDataList(this.selectedCategory).getPoints().entries();
      for (const [filter, points] of pts) {
        this.dataList.set(filter, new MatTableDataSource<DataPoint>(points));
      }
      this.categorySpec = this.conveyor.getCategorySpec(this.selectedCategory);
    }
  }


  updateSelected(event) {
    this.selectedRows = event;
    this.selectedRowsLength = this.selectedRows.selected.length;
  }

  clearSelected() {
    this.selectedRows.clear();
    this.selectedRowsLength = 0;
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
    const dialogRef = this.dialog.open(DataFilterDialogComponent, {
      data: this.selectedCategory
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openRemovalDialog() {
    if (this.selectedRows.selected.length > 0) {
      const dialogRef = this.dialog.open(DataRemovalDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        // If result is true, that means the user pressed the button for
        // removing selected values
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
      .removePoints(this.selectedRows.selected);
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
