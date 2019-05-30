import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Filter } from 'src/app/ehr/datalist';
import { Conveyor } from 'src/app/conveyor.service';

import { MathFunctionEnum, mathFunctionString } from 'src/app/ehr/datatype';
import { PeriodWidth, periodString } from 'src/app/shared/period';

@Component({
  selector: 'app-data-filter-dialog',
  templateUrl: 'data-filter-dialog.component.html',
  styleUrls: ['./data-filter-dialog.component.scss'],
})
export class DataFilterDialogComponent {
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

  mathFunction: string;
  interval: string;


  selectedCategory: string;

  constructor(
    private conveyor: Conveyor,
    public dialogRef: MatDialogRef<DataFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.selectedCategory = data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Calls the setInterval function in order to do math manipulations on the
   * data
   * @param intervalString A string containing a PeriodWidth enum, must be
   * converted to int
   * @param funcString A string containing a Mathfunction enum, must be
   * converted to int
   */
  calculate(intervalString: string, funcString: string) {
    if (intervalString && funcString) {
      const filter: Filter = {
        width: parseInt(intervalString, 10),
        fn: parseInt(funcString, 10),
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
