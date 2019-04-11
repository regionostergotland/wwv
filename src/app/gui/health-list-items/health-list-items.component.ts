import {Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import { CategorySpec,
         DataTypeCodedText,
         DataTypeCodedTextOpt,
         DataTypeEnum,
         MathFunctionEnum} from '../../ehr/datatype';
import { DataPoint } from '../../ehr/datalist';
import {Conveyor} from '../../conveyor.service';
import {AddDataPointComponent} from '../add-data-point/add-data-point.component';
import {MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

export interface mathOption {
  value: MathFunctionEnum;
  description: string;
}

export interface intervalOption {
  value: number;
  description: string;
}

const MATH_OPTIONS: mathOption[] = [
  {value: MathFunctionEnum.ACTUAL, description: "Faktiskt värde"},
  {value: MathFunctionEnum.MAX, description: "Maximalt värde"},
  {value: MathFunctionEnum.MEAN, description: "Medelvärde"},
  {value: MathFunctionEnum.MEDIAN, description: "Median"},
  {value: MathFunctionEnum.MIN, description: "Minimalt värde"},
  {value: MathFunctionEnum.TOTAL, description: "Totala värde"},
];

const INTERVAL_OPTIONS: intervalOption[] = [
  {value: 1000*3600, description: "Per timme"},
  {value: 1000*3600*24-1, description: "Per dygn"},
  {value: 1000*3600*24*2, description: "Varannat dygn"},
  {value: 1000*3600*24*7, description: "Per vecka"},
];

@Component({
  selector: 'app-removal-dialog',
  templateUrl: 'removal-dialog.html',
})
export class RemovalDialogComponent {

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
})
export class MathDialogComponent {

  mathOptions: mathOption[];
  mathFunction: string;
  intervalOptions: intervalOption[];
  interval: string;

  selectedCategory: string;

  constructor(private conveyor: Conveyor, 
    public dialogRef: MatDialogRef<MathDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: string) {
  
    this.selectedCategory = data;
    this.mathOptions = MATH_OPTIONS;
    this.intervalOptions = INTERVAL_OPTIONS;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  calculate(intervalString: string, funcString: string) {
    if (intervalString && funcString) {
      let interval = parseInt(intervalString, 10);
      let func = parseInt(funcString, 10); 
      console.log(interval);
      console.log(func);
      this.conveyor.getDataList(this.selectedCategory).setInterval(interval, func);
      this.closeDialog();
    }
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
  categorySpec: CategorySpec;
  pointDataList: DataPoint[];
  displayedColumns: string[];
  options: Map<string, DataTypeCodedTextOpt[]>;
  
  // mathOptions: mathOption[];
  // mathFunction: string;
  // intervalOptions: intervalOption[];
  // interval: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataList: MatTableDataSource<DataPoint>;

  // The selected datapoints
  selection = new SelectionModel<DataPoint>(true, []);

  /**
   * Gets a string representation of the date correctly formatted to be read by a human.
   * @param date the date to format
   * @returns a formatted string representing a date
   */
  static getDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  /**
   * Gets a string representation of the time correctly formatted to be read by a human.
   * @param date the date to get the time from to format
   * @returns a formatted string representing a time
   */
  static getTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

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
    for (const point of this.selection.selected) {
      point.removed = true;
    }
    this.selection.clear();
/*
    const newList: DataPoint[] = [];
    for (const point of this.conveyor.getDataList(this.selectedCategory).getPoints()) {
      if (!point.removed) {
        newList.push(point);
      }
    }
    this.conveyor.getDataList(this.selectedCategory).setPoints(newList);*/
    this.ngOnInit();
  }

  /**
   * Gets the data to be displayed from the point
   * @param point the datapoint to get the data from
   * @param key the data category to get
   * @returns a string of the value to show
   */
  getPointData(point: DataPoint, key: string): string {
    if (key === 'date') {
      return HealthListItemsComponent.getDate(point.get('time'));
    }
    if (key === 'time') {
      return HealthListItemsComponent.getTime(point.get('time'));
    }
    return point.get(key);
  }

  // calculate(intervalString: string, funcString: string) {
  //   let interval = parseInt(intervalString, 10);
  //   let func = parseInt(funcString, 10); 
  //   console.log(interval);
  //   console.log(func);
  //   this.conveyor.getDataList(this.selectedCategory).setInterval(interval, func);
  //   this.ngOnInit();
  // }

  ngOnInit() {
    if (this.selectedCategory) {
      // Reset all the internal lists.
      this.categorySpec = this.conveyor.getCategorySpec(this.selectedCategory);
      this.pointDataList = this.conveyor.getDataList(this.selectedCategory).getPoints();
      this.displayedColumns = this.getDisplayedColumns();
      this.options = new Map<string, DataTypeCodedTextOpt[]>();

      //this.mathOptions = MATH_OPTIONS;
      //this.intervalOptions = INTERVAL_OPTIONS;

      // Fill options and visibleStrings
      for (const key of Array.from(this.categorySpec.dataTypes.keys())) {

        // Fill options
        if (this.categorySpec.dataTypes.get(key).type === DataTypeEnum.CODED_TEXT) {
          const datatypes: DataTypeCodedText = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeCodedText;
          this.options.set(key, datatypes.options);
        }
      }
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
    const dialogRef = this.dialog.open(MathDialogComponent, {
      data: this.selectedCategory
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    })
  }

  /**
   * Gets all data points from the facade
   * @returns a list of all datapoints in the category
   */
  getData(): DataPoint[] {
    if (this.selectedCategory) {
      return this.pointDataList;
    }
    return [];
  }

  /**
   * Get the label for the category.
   * @returns the label for the category.
   */
  getCategoryLabel(): string {
    if (this.categorySpec) {
      return this.categorySpec.label;
    }
    return '';
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
      for (const column of Array.from(this.conveyor.getDataList(this.selectedCategory).spec.dataTypes.keys())) {
        if (column === 'device_name' || column === 'type' || column === 'manufacturer') {
          continue;
        } else if (column === 'time') {
          result.push('date');
          result.push('time');
        } else {
          result.push(column);
        }
      }
    }
    return result;
  }

  /**
   * Set all unset data types in a category
   * @param key the data category to be set
   * @param option the option to set
   */
  setAllOptions(key: string, option: string) {
    let allData = true;
    for (const point of this.getData()) {
      if (!point.has(key)) {
        HealthListItemsComponent.setOption(key, point, option);
        allData = false;
      }
    }
    if (allData) {
      for (const point of this.getData()) {
        HealthListItemsComponent.setOption(key, point, option);
      }
    }
  }

}
