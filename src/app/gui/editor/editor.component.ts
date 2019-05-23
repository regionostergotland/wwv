import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataPoint, Filter, filterString } from 'src/app/ehr/datalist';
import { Conveyor } from 'src/app/conveyor.service';

import { AddDataPointComponent } from '../add-data-point/add-data-point.component';
import { MathFunctionEnum, mathFunctionString,
         CategorySpec } from 'src/app/ehr/datatype';
import { PeriodWidth, periodString } from 'src/app/shared/period';

@Component({
  selector: 'app-removal-dialog',
  templateUrl: 'removal-dialog.html',
})
export class RemovalDialogComponent {

  // This boolean is sent to the health-list-items-component if the
  // user presses the remove button
  remove = true;

  constructor(
    private conveyor: Conveyor,
    public dialogRef: MatDialogRef<RemovalDialogComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-math-dialog',
  templateUrl: 'math-dialog.html',
  styleUrls: ['./editor.component.scss']
})
export class MathDialogComponent {
  mathOptions: MathFunctionEnum[] = [
    MathFunctionEnum.MAX,
    MathFunctionEnum.MEAN,
    MathFunctionEnum.MEDIAN,
    MathFunctionEnum.MIN,
    MathFunctionEnum.TOTAL,
  ];
  intervalOptions: PeriodWidth[] = [
    PeriodWidth.HOUR,
    PeriodWidth.DAY,
    PeriodWidth.WEEK,
    PeriodWidth.MONTH,
    PeriodWidth.YEAR,
  ];
  mathFunctionString = mathFunctionString;
  periodString = periodString;

  selectedCategory: string;

  constructor(
    private conveyor: Conveyor,
    public dialogRef: MatDialogRef<MathDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
    this.selectedCategory = data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Calls the setInterval function in order to do math manipulations on the data
   * @param intervalString A string containing a PeriodWidth enum, must be converted to int
   * @param funcString A string containing a Mathfunction enum, must be converted to int
   */
  calculate(intervalString: string, funcString: string) {
    if (intervalString && funcString) {
      const filter: Filter = {
        width: parseInt(intervalString, 10),
        fn: parseInt(funcString, 10)
      };
      this.conveyor.getDataList(this.selectedCategory).addFilter(filter);
      this.closeDialog();
    }
  }

  /**
   * Restores the datalist to the default settings
   */
  changeBack() {
    this.conveyor.getDataList(this.selectedCategory).resetFilter();
    this.closeDialog();
  }
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
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

  constructor(private conveyor: Conveyor, public dialog: MatDialog) { }

  ngOnInit() {
    this.selectedRows = [];
    this.dataList = new Map<Filter, MatTableDataSource<DataPoint>>();
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
    const dialogRef = this.dialog.open(AddDataPointComponent, {
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
    const dialogRef = this.dialog.open(MathDialogComponent, {
      data: this.selectedCategory
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openRemovalDialog() {
    if (this.selectedRows.length > 0) {
      const dialogRef = this.dialog.open(RemovalDialogComponent);
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
