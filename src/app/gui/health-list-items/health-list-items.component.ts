import {Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import { CategorySpec,
         DataTypeCodedText,
         DataTypeCodedTextOpt,
         DataTypeEnum,
         MathFunctionEnum,
         } from '../../ehr/datatype';
import { DataPoint } from '../../ehr/datalist';
import { PeriodWidths } from '../../shared/period';
import {Conveyor} from '../../conveyor.service';
import {AddDataPointComponent} from '../add-data-point/add-data-point.component';
import {MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import '../../shared/date.extensions';

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
  selector: 'app-removal-dialog',
  templateUrl: 'removal-dialog.html',
})
export class RemovalDialogComponent {

  // This boolean is sent to the health-list-items-component if the
  // user presses the remove button
  remove = true;

  constructor(private conveyor: Conveyor, public dialogRef: MatDialogRef<RemovalDialogComponent>) {
    }

  closeDialog(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-math-dialog',
  templateUrl: 'math-dialog.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class MathDialogComponent {

  mathOptions: MathOption[];
  mathFunction: string;
  intervalOptions: IntervalOption[];
  interval: string;

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
      const interval = parseInt(intervalString, 10);
      const func = parseInt(funcString, 10);
      this.conveyor.getDataList(this.selectedCategory).setWidth(interval);
      this.conveyor.getDataList(this.selectedCategory).addMathFunction(func);
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
  selector: 'app-health-list-items',
  templateUrl: './health-list-items.component.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class HealthListItemsComponent implements OnInit {

  @Input() set selectCategory(value: string) {
    if (this.selectedCategory) {
      this.selectedCategory = value;
      this.ngOnInit();
    } else {
      this.selectedCategory = value;
    }
  }

  @Input() set editable(value: boolean) {
    this.isEditable = value;
  }

  constructor(private conveyor: Conveyor, public dialog: MatDialog) {
  }

  selectedCategory: string;
  isEditable = false;

  dataTypeEnum = DataTypeEnum;
  periodWidths = PeriodWidths;
  categorySpec: CategorySpec;
  pointDataList: DataPoint[];
  displayedColumns: string[];
  options: Map<string, DataTypeCodedTextOpt[]>;

  periodLabels: Map<string, string> = new Map<string, string>([
    ['period_DAY', 'Dag'],
    ['period_WEEK', 'Vecka'],
    ['period_YEAR', 'År'],
    ['period_MONTH', 'Månad'],
    ['date', 'Datum']]);

  periodDescriptions: Map<string, string> = new Map<string, string>([
    ['period_DAY', 'Dag för mätning'],
    ['period_WEEK', 'Vecka för mätning'],
    ['period_YEAR', 'År för mätning'],
    ['period_MONTH', 'Månad för mätning'],
    ['date', 'Datum för mätning']]);

  mathOptions: Map<MathFunctionEnum, string> =
    new Map<MathFunctionEnum, string>([
    [MathFunctionEnum.MAX, ', maximalt värde '],
    [MathFunctionEnum.MEAN, ', medelvärde '],
    [MathFunctionEnum.MEDIAN, ', median '],
    [MathFunctionEnum.MIN, ', minimalt värde '],
    [MathFunctionEnum.TOTAL, ', totala värde '],
  ]);

  intervalOptions: Map<PeriodWidths, string> = new Map<PeriodWidths, string>([
    [PeriodWidths.HOUR, 'per timme'],
    [PeriodWidths.DAY, 'per dygn'],
    [PeriodWidths.WEEK, 'per vecka'],
    [PeriodWidths.MONTH, 'per månad'],
    [PeriodWidths.YEAR, 'per år'],
  ]);

  mathOption: string;
  intervalOption: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataList: MatTableDataSource<DataPoint>;

  // The selected datapoints
  selection = new SelectionModel<DataPoint>(true, []);

  /**
   * Sets the data category in the dataPoint to the set option
   * @param key the data category to set
   * @param point the point to set data in
   * @param option the option to set
   */
  static setOption(key: string, point: DataPoint, option: string) {
    point.set(key, option);
  }

  /**
   * Checks whether the number of selected elements matches the total number of rows.
   * @returns a boolean, true of selected elements matches total number of rows
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataList.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataList.data.forEach(row => this.selection.select(row));
  }

  /**
   * Opens the dialog containing RemovalDialogComponent
   */
  openRemovalDialog() {
    if (this.selection.selected.length > 0) {
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
    this.conveyor.getDataList(this.selectedCategory).removePoints(this.selection.selected);
    this.ngOnInit();
  }

  ngOnInit() {
    if (this.selectedCategory) {
      // Reset all the internal lists.
      this.categorySpec = this.conveyor.getCategorySpec(this.selectedCategory);
      // TODO update for math fns
      this.pointDataList = this.conveyor.getDataList(this.selectedCategory).getPoints(0);
      this.displayedColumns = this.getDisplayedColumns();
      this.options = new Map<string, DataTypeCodedTextOpt[]>();
      this.selection.clear();

      // Fill options and visibleStrings
      for (const key of Array.from(this.categorySpec.dataTypes.keys())) {

        // Fill options
        if (this.categorySpec.dataTypes.get(key).type === DataTypeEnum.CODED_TEXT) {
          const datatypes: DataTypeCodedText = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeCodedText;
          this.options.set(key, datatypes.options);
        }
      }
      this.mathOption = this.mathOptions.has(this.conveyor.getDataList(this.selectedCategory).getMathFunction()) ?
        this.mathOptions.get(this.conveyor.getDataList(this.selectedCategory).getMathFunction()) : '';
      this.intervalOption = this.intervalOptions.has(this.conveyor.getDataList(this.selectedCategory).getWidth()) ?
        this.intervalOptions.get(this.conveyor.getDataList(this.selectedCategory).getWidth()) : '';
    }
    this.dataList = new MatTableDataSource<DataPoint>(this.pointDataList);
    this.dataList.paginator = this.paginator;
  }

  trackItem(index, item) {
    return item ? index : undefined;
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
    this.selection.clear();
    const dialogRef = this.dialog.open(MathDialogComponent, {
      data: this.selectedCategory
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }

  /**
   * Used to make sure the tables don't display a bunch of decimals.
   * Checks if num is an integer or float. If num is an integer, it simply returns the number.
   * If num is a float, it returns a string containing only 1 decimal.
   * @param num The original number to check
   */
  displayCorrectNum(num: number): any {
    if ((num % 1) === 0) {
      return num;
    }
    return num.toFixed(1);
  }

  /**
   * Returns the columns which should be displayed in the table depending on which
   * category it is.
   * @returns a list of labels for the specified category
   */
  getDisplayedColumns(): string[] {
    const result: string[] = [];
    if (this.isEditable) {
      result.push('select');
    }
    if (this.selectedCategory) {
      const dataList = this.conveyor.getDataList(this.selectedCategory);
      for (const [column, dataType] of dataList.spec.dataTypes.entries()) {
        if (!dataType.visible) {
          continue;
        } else if (column === 'time') {
          switch (dataList.getWidth()) {
            case PeriodWidths.DAY: result.push('period_DAY'); break;
            case PeriodWidths.MONTH: result.push('period_MONTH'); break;
            case PeriodWidths.WEEK: result.push('period_WEEK'); break;
            case PeriodWidths.YEAR: result.push('period_YEAR'); break;
            default :
              result.push('date');
              result.push('time');
          }
        } else {
          result.push(column);
        }
      }
    }
    return result;
  }

}
