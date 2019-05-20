import {Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import { CategorySpec,
         DataTypeCodedText,
         DataTypeCodedTextOpt,
         DataTypeEnum,
         MathFunctionEnum,
         } from '../../ehr/datatype';
import { DataPoint, Filter } from '../../ehr/datalist';
import { PeriodWidths } from '../../shared/period';
import {Conveyor} from '../../conveyor.service';
import {AddDataPointComponent} from '../add-data-point/add-data-point.component';
import {MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatTabsModule} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import '../../shared/date.extensions';
import * as dayjs from 'dayjs';

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
  //pointDataList: Map<MathFunctionEnum, DataPoint[]>;
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataList: Map<Filter, MatTableDataSource<DataPoint>>;

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
   *
   *  @returns a boolean, true of selected elements matches total number of rows
   */
  isAllSelected(filter: Filter): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataList.get(filter).data.length;
    return numSelected === numRows;
  }

  getCategoryTooltip(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return this.periodDescriptions.get(key);
    }
    return this.categorySpec.dataTypes.get(key).description;
  }


  getTextFromPoint(key: string, point: DataPoint): string {
    if (key === 'date') {
      return dayjs(point.get('time')).format('MM-DD');
    }

    if (key.startsWith('period')) {
      const v = point.get('time');
      switch (key) {
        case 'period_DAY': return dayjs(v).format('MM-DD');
        case 'period_WEEK': return 'v' + v.getWeek() + ', ' + v.getWeekYear();
        case 'period_MONTH': return dayjs(v).format('YY-MM');
        case 'period_YEAR': return dayjs(v).format('YY');
      }
    }

    if (this.categorySpec.dataTypes.has(key)) {
        const dt = this.categorySpec.dataTypes.get(key);
        switch (dt.type) {
          case this.dataTypeEnum.DATE_TIME: return dayjs(point.get(key)).format('hh:mm');
          case this.dataTypeEnum.QUANTITY:
            const s = this.displayCorrectNum(point.get(key));
            return this.isSmallScreen() ? s : s + this.getCategoryUnit(key);
          case this.dataTypeEnum.TEXT: return point.get(key);
        }
    }

    if (!point.has(key)) {
      throw new Error(`${key} value function is not implemented.`);
    }

    return point.get(key);
  }

  /**
   *  Uses a media-query to be in line with flex-layouts lt-sm, thats used throughout the
   *  app.
   *  https://github.com/angular/flex-layout/wiki/Responsive-API
   */

  isSmallScreen(): boolean {
    return window.matchMedia('(max-width: 599px)').matches;
  }

  /**
   *  Determines if a category should be hidden from display on smaller screens
   * @param key datatype of category
   */

  shouldHide(key: string): boolean {
    if (key === 'mobile') {
      return true;
    }

    if (!this.isSmallScreen()) {
      return false;
    }

    if (this.categorySpec.dataTypes.has(key) || key === 'mobile') {
      const { visibleOnMobile } = this.categorySpec.dataTypes.get(key);
      return !visibleOnMobile;
    }

    return false;
  }


  getDataType(key: string) {
    switch (key) {
      case 'position':
      case 'state_of_dress':
        return 'select';
      case 'comment':
        return 'text-input';
      case 'mobile-edit-button':
        return 'monile';
      default:
        return 'text';
    }
  }




  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle(filter: Filter) {
    this.isAllSelected(filter) ?
        this.selection.clear() :
        this.dataList.get(filter).data.forEach(row => this.selection.select(row));
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
      this.dataList = new Map<Filter, MatTableDataSource<DataPoint>>();
      for (let [filter, points] of this.conveyor.getDataList(this.selectedCategory).getPoints().entries()) {
        this.dataList.set(filter, new MatTableDataSource<DataPoint>(points));
        //this.dataList.get(filter).paginator = this.paginator;
      }
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
    }
  }

  trackItem(index, item) {
    return item ? index : undefined;
  }


  openEditDialog(point: DataPoint, key: string): void {
    const dialogRef = this.dialog.open(AddDataPointComponent, {
      data: {category: this.selectedCategory, point}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }

  /**
   * Opens the dialog to add an item in the list stored in the conveyor.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(AddDataPointComponent, {
      data: { category: this.selectedCategory }
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

  getCategoryUnit(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return '';
    }
    const dataType = this.categorySpec.dataTypes.get(key);
    return  dataType.unit ? dataType.unit : '';
  }

  getCategoryLabel(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return this.periodLabels.get(key);
    }
    return this.categorySpec.dataTypes.get(key).label;
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
  getDisplayedColumns(filter: Filter): string[] {
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
          switch (filter.width) {
            case PeriodWidths.DAY: result.push('period_DAY'); break;
            case PeriodWidths.MONTH: result.push('period_MONTH'); break;
            case PeriodWidths.WEEK: result.push('period_WEEK'); break;
            case PeriodWidths.YEAR: result.push('period_YEAR'); break;
            default :
              result.push('date');
              result.push('time');
          }
        } else {
          if (!this.shouldHide(column)) {
            result.push(column);
          }
        }
      }
      if (this.isSmallScreen()) {
        result.push('mobile');
      }
    }

    return result;
  }

}
