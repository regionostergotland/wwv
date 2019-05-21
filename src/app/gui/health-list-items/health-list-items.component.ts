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
//import {AddDataPointComponent} from '../add-data-point/add-data-point.component';
import {MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import '../../shared/date.extensions';

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
  selector: 'app-health-list-items',
  templateUrl: './health-list-items.component.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class HealthListItemsComponent implements OnInit {

  @Input() width: PeriodWidths;

  @Input() category: string;

  @Input() isEditable: boolean;

  @Input() set dataList(value: MatTableDataSource<DataPoint>) {
    this.data = value;
  }

  constructor(private conveyor: Conveyor, public dialog: MatDialog) {
  }

  // selectedCategory: string;
  //isEditable = false;

  // allow access to these from html component
  dataTypeEnum = DataTypeEnum;
  ///periodWidths = PeriodWidths;
  categorySpec: CategorySpec;
  
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: MatTableDataSource<DataPoint>;

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
  // isAllSelected(filter: Filter): boolean {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataList.get(filter).data.length;
  //   return numSelected === numRows;
  // }

  // /**
  //  * Selects all rows if they are not all selected; otherwise clear selection.
  //  */
  // masterToggle(filter: Filter) {
  //   this.isAllSelected(filter) ?
  //       this.selection.clear() :
  //       this.dataList.get(filter).data.forEach(row => this.selection.select(row));
  // }

  /**
   * Opens the dialog containing RemovalDialogComponent
   */
  // openRemovalDialog() {
  //   if (this.selection.selected.length > 0) {
  //     const dialogRef = this.dialog.open(RemovalDialogComponent);
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //       // If result is true, that means the user pressed the button for removing selected values
  //       if (result) {
  //         this.removeSelected();
  //       }
  //     });
  //   }
  // }

  // /**
  //  * Removes all of the selected datapoints and updates the list
  //  */
  // removeSelected() {
  //   this.conveyor.getDataList(this.category).removePoints(this.selection.selected);
  //   this.ngOnInit();
  // }

  ngOnInit() {
    if (this.category) {
      // Reset all the internal lists.
      this.categorySpec = this.conveyor.getCategorySpec(this.category);
      
      this.data.paginator = this.paginator;

      this.options = new Map<string, DataTypeCodedTextOpt[]>();
      this.selection.clear();

      // Fill options and visibleStrings
      for (const key of Array.from(this.categorySpec.dataTypes.keys())) {

        // Fill options
        if (this.categorySpec.dataTypes.get(key).type === DataTypeEnum.CODED_TEXT) {
          const datatypes: DataTypeCodedText = this.conveyor.getDataList(this.category).getDataType(key) as DataTypeCodedText;
          this.options.set(key, datatypes.options);
        }
      }
    }
  }

  trackItem(index, item) {
    return item ? index : undefined;
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
    if (this.category) {
      const dataList = this.conveyor.getDataList(this.category);
      for (const [column, dataType] of dataList.spec.dataTypes.entries()) {
        if (!dataType.visible) {
          continue;
        } else if (column === 'time') {
          switch (this.width) {
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
