import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { CategorySpec,
         DataTypeCodedText,
         DataTypeCodedTextOpt,
         DataTypeEnum,
         } from '../../ehr/datatype';
import { DataPoint } from '../../ehr/datalist';
import { PeriodWidths } from '../../shared/period';
import {Conveyor} from '../../conveyor.service';
import { AddDataPointComponent } from '../add-data-point/add-data-point.component';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import '../../shared/date.extensions';
import * as dayjs from 'dayjs';

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

  // TODO rename to selected?
  @Output() change: EventEmitter<DataPoint[]> = new EventEmitter<DataPoint[]>();

  constructor(private conveyor: Conveyor, public dialog: MatDialog) {
  }

  dataTypeEnum = DataTypeEnum;
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
   *
   *  @returns a boolean, true of selected elements matches total number of rows
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.data.length;
    return numSelected === numRows;
  }

  getCategoryUnit(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return '';
    }
    const dataType = this.categorySpec.dataTypes.get(key);
    return dataType.unit ? dataType.unit : '';
  }

  getCategoryLabel(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return this.periodLabels.get(key);
    }
    return this.categorySpec.dataTypes.get(key).label;
  }


  getCategoryTooltip(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return this.periodDescriptions.get(key);
    }
    return this.categorySpec.dataTypes.get(key).description;
  }


  getTextFromPoint(key: string, point: DataPoint): string {
    if (key === 'date') {
      return dayjs(point.get('time')).format('YYYY-MM-DD');
    }

    if (key.startsWith('period')) {
      const v = point.get('time');
      switch (key) {
        case 'period_DAY': return dayjs(v).format('YYYY-MM-DD');
        case 'period_WEEK': return 'v' + v.getWeek() + ', ' + v.getWeekYear();
        case 'period_MONTH': return dayjs(v).format('YY-MM');
        case 'period_YEAR': return dayjs(v).format('YYYY');
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
          case this.dataTypeEnum.CODED_TEXT:
            for (const option of this.options.get(key)) {
              if (option.code === point.get(key)) {
                return option.label;
              }
            }
            return '';
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

    if (this.categorySpec.dataTypes.has(key)) {
      const { visibleOnMobile } = this.categorySpec.dataTypes.get(key);
      return !visibleOnMobile;
    }

    return false;
  }

  /**
   *
   * @param key key of column
   * @returns string representing what type of element to use
   */

  getInputType(key: string) {
    if (key === 'mobile') {
      return 'mobile';
    }

    if (key.startsWith('period_') || key === 'date') {
      return 'text';
    }

    switch (this.categorySpec.dataTypes.get(key).type) {
      case this.dataTypeEnum.CODED_TEXT:
        return this.isEditable ? 'select' : 'text';
      case this.dataTypeEnum.TEXT:
        return this.isEditable ? 'text-input' : 'text';
      case this.dataTypeEnum.QUANTITY:
      case this.dataTypeEnum.DATE_TIME:
        return 'text';
      default:
        throw new Error('Datatype not recognized');
    }
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.data.data.forEach(row => this.selection.select(row));
    this.change.emit(this.selection.selected);
  }

  toggleRow(row) {
    this.selection.toggle(row);
    this.change.emit(this.selection.selected);
  }

  ngOnInit() {
    if (this.category) {
      // Reset all the internal lists.
      this.categorySpec = this.conveyor.getCategorySpec(this.category);
      this.data.paginator = this.paginator;
      this.displayedColumns = this.getDisplayedColumns();

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
    window.onresize = () => {
      this.displayedColumns = this.getDisplayedColumns();
    };
  }

  trackItem(index, item) {
    return item ? index : undefined;
  }

  openEditDialog(point: DataPoint, key: string): void {
    const dialogRef = this.dialog.open(AddDataPointComponent, {
      data: {category: this.category, point}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  /*
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
          if (!this.shouldHide(column)) {
            result.push(column);
          }
        }
      }
      if (this.isSmallScreen() && this.isEditable) {
        result.push('mobile');
      }
    }

    return result;
  }

}
