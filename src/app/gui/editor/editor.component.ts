import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataPoint, Filter } from 'src/app/ehr/datalist';
import { Conveyor } from 'src/app/conveyor.service';

import {AddDataPointComponent} from '../add-data-point/add-data-point.component';
import { MathFunctionEnum } from 'src/app/ehr/datatype';
import { PeriodWidths } from 'src/app/shared/period';

export interface MathOption {
  value: MathFunctionEnum;
  description: string;
}

export interface IntervalOption {
  value: PeriodWidths;
  description: string;
}

const MATH_OPTIONS: MathOption[] = [
  {value: MathFunctionEnum.MAX, description: 'Maximalt värde'},
  {value: MathFunctionEnum.MEAN, description: 'Medelvärde'},
  {value: MathFunctionEnum.MEDIAN, description: 'Median'},
  {value: MathFunctionEnum.MIN, description: 'Minimalt värde'},
  {value: MathFunctionEnum.TOTAL, description: 'Totala värde'},
];

const INTERVAL_OPTIONS: IntervalOption[] = [
  {value: PeriodWidths.HOUR, description: 'Per timme'},
  {value: PeriodWidths.DAY, description: 'Per dygn'},
  {value: PeriodWidths.WEEK, description: 'Per vecka'},
  {value: PeriodWidths.MONTH, description: 'Per månad'},
  {value: PeriodWidths.YEAR, description: 'Per År'},
];

@Component({
  selector: 'app-math-dialog',
  templateUrl: 'math-dialog.html',
  styleUrls: ['./editor.component.scss']
})
export class MathDialogComponent {

  mathOptions: MathOption[];
  intervalOptions: IntervalOption[];

  selectedCategory: string;

  constructor(
    private conveyor: Conveyor,
    public dialogRef: MatDialogRef<MathDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {

    this.selectedCategory = data;
    this.mathOptions = MATH_OPTIONS;
    this.intervalOptions = INTERVAL_OPTIONS;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Calls the setInterval function in order to do math manipulations on the data
   * @param intervalString A string containing a PeriodWidths enum, must be converted to int
   * @param funcString A string containing a Mathfunction enum, must be converted to int
   */
  calculate(intervalString: string, funcString: string) {
    if (intervalString && funcString) {
      const filter: Filter = {
        width: parseInt(intervalString, 10),
        fn: parseInt(funcString, 10)
      }
      this.conveyor.getDataList(this.selectedCategory).addFilter(filter);
      this.closeDialog();
    }
  }

  /**
   * Restores the datalist to the default settings
   */
  changeBack() {
    this.conveyor.getDataList(this.selectedCategory).resetInterval();
    this.closeDialog();
  }

}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  mathOptions: Map<MathFunctionEnum, string> =
    new Map<MathFunctionEnum, string>([
    [MathFunctionEnum.MAX, 'maximalt värde '],
    [MathFunctionEnum.MEAN, 'medelvärde '],
    [MathFunctionEnum.MEDIAN, 'median '],
    [MathFunctionEnum.MIN, 'minimalt värde '],
    [MathFunctionEnum.TOTAL, 'totala värde '],
  ]);

intervalOptions: Map<PeriodWidths, string> = new Map<PeriodWidths, string>([
    [PeriodWidths.HOUR, 'per timme'],
    [PeriodWidths.DAY, 'per dygn'],
    [PeriodWidths.WEEK, 'per vecka'],
    [PeriodWidths.MONTH, 'per månad'],
    [PeriodWidths.YEAR, 'per år'],
  ]);

  @Input() editable: boolean;

  @Input() set selectCategory(value: string) {
    if (this.selectedCategory) {
      this.selectedCategory = value;
      this.ngOnInit();
    } else {
      this.selectedCategory = value;
    }
  }
  selectedCategory: string;
  dataList: Map<Filter, MatTableDataSource<DataPoint>>;

  constructor(private conveyor: Conveyor, public dialog: MatDialog) { }

  ngOnInit() {
    this.dataList = new Map<Filter, MatTableDataSource<DataPoint>>();
    for (let [filter, points] of this.conveyor.getDataList(this.selectedCategory).getPoints().entries()) {
      this.dataList.set(filter, new MatTableDataSource<DataPoint>(points));
    }
  }

  /**
   * Opens the dialog to add an item in the list stored in the conveyor.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(AddDataPointComponent, {
      data: this.selectedCategory
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }

  /**
   * Opens the dialog for MathDialogComponent
   */
  openMathDialog(): void {
    //this.selection.clear();
    const dialogRef = this.dialog.open(MathDialogComponent, {
      data: this.selectedCategory
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }

}
