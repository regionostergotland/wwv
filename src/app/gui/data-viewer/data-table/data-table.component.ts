import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import * as dayjs from 'dayjs';

import { CategorySpec,
         DataTypeCodedText,
         DataTypeCodedTextOpt,
         DataTypeEnum,
         } from 'src/app/ehr/datatype';
import { DataPoint } from 'src/app/ehr/datalist';
import { PeriodWidth } from 'src/app//shared/period';
import {Conveyor} from 'src/app/conveyor.service';
import {
  DataPointDialogComponent
} from '../data-point-dialog/data-point-dialog.component';
import 'src/app/shared/date.extensions';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() set dataList(value: MatTableDataSource<DataPoint>) {
    this.data = value;
  }

  constructor(
    private conveyor: Conveyor,
    public dialog: MatDialog
  ) {}
  @Input() width: PeriodWidth;
  @Input() category: string;
  @Input() isEditable: boolean;
  @Output() selectedPoints: EventEmitter<SelectionModel<DataPoint>> =
    new EventEmitter<SelectionModel<DataPoint>>();

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
   * Adds a correct translation of the range label of the paginator
   */
  customRangeLabel(page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) { return `0 av ${length}`; }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;

    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} av ${length}`;
  }

  /**
   * Add pagination to the tables, with correct translations
   */
  addPaginator() {
    // Translations for the table paginator
    this.paginator._intl.itemsPerPageLabel = 'Antal per sida';
    this.paginator._intl.firstPageLabel = 'Första sida';
    this.paginator._intl.previousPageLabel = 'Föregående sida';
    this.paginator._intl.nextPageLabel = 'Nästa sida';
    this.paginator._intl.lastPageLabel = 'Sista sida';
    this.paginator._intl.getRangeLabel = this.customRangeLabel;
    this.data.paginator = this.paginator;
  }

  /**
   * Checks whether the number of selected elements matches the total number of
   * rows.
   * @returns a boolean, true of selected elements matches total number of rows
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.data.length;
    return numSelected === numRows;
  }

  /**
   *
   * @param key datatype key
   * @returns the datatypes unit (e.g. kg or m)
   */
  getDataTypeUnit(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return '';
    }
    const dataType = this.categorySpec.dataTypes.get(key);
    return dataType.unit ? dataType.unit : '';
  }

  /**
   *  @param key datatype key
   *  @returns human readable label of datatype
   */
  getDataTypeLabel(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return this.periodLabels.get(key);
    }
    return this.categorySpec.dataTypes.get(key).label;
  }

  /**
   *  @param key keyn of column
   *  @returns description of datatype
   */
  getCategoryTooltip(key: string): string {
    if (!this.categorySpec.dataTypes.has(key)) {
      return this.periodDescriptions.get(key);
    }
    return this.categorySpec.dataTypes.get(key).description;
  }

  /**
   *
   * Retrieve text formatting for a text field
   * @param key key of the field
   * @param point point containing the value
   * @returns formatted string to display
   */
  getFormattedTextFromPoint(key: string, point: DataPoint): string {
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
          case this.dataTypeEnum.DATE_TIME:
            return dayjs(point.get(key)).format('HH:mm');
          case this.dataTypeEnum.QUANTITY:
            const s = this.displayCorrectNum(point.get(key));
            return this.isSmallScreen() ? s : s + ' '
            + this.getDataTypeUnit(key);
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
   *  Uses a media-query to be in line with flex-layouts lt-sm, thats used
   *  throughout the app.
   *  https://github.com/angular/flex-layout/wiki/Responsive-API
   */
  isSmallScreen(): boolean {
    return window.matchMedia('(max-width: 599px)').matches;
  }

  /**
   *  Determines if a category should be hidden from display on smaller screens
   *  @param key column name
   */
  shouldHide(key: string): boolean {
    if (key === 'dialog') {
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
    if (key === 'dialog') {
      return key;
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
    this.selectedPoints.emit(this.selection);
  }

  toggleRow(row) {
    this.selection.toggle(row);
    this.selectedPoints.emit(this.selection);
  }

  ngOnInit() {
    if (this.category) {
      // Reset all the internal lists.
      this.categorySpec = this.conveyor.getCategorySpec(this.category);
      this.addPaginator();
      this.displayedColumns = this.getDisplayedColumns();

      this.options = new Map<string, DataTypeCodedTextOpt[]>();
      this.selection.clear();

      // Fill options and visibleStrings
      for (const key of Array.from(this.categorySpec.dataTypes.keys())) {
        // Fill options
        if (this.categorySpec.dataTypes.get(key).type
            === DataTypeEnum.CODED_TEXT) {
          const datatypes: DataTypeCodedText =
            this.conveyor.getDataList(this.category)
              .getDataType(key) as DataTypeCodedText;
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

  openEditDialog(point: DataPoint, isEditable: boolean): void {
    const dialogRef = this.dialog.open(DataPointDialogComponent, {
      data: {category: this.category, point, isEditable}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  /*
   * Used to make sure the tables don't display a bunch of decimals.  Checks if
   * num is an integer or float. If num is an integer, it simply returns the
   * number.  If num is a float, it returns a string containing only 1 decimal.
   * @param num The original number to check
   */
  displayCorrectNum(num: number): any {
    if ((num % 1) === 0) {
      return num;
    }
    return num.toFixed(1);
  }

  /**
   * Returns the columns which should be displayed in the table depending on
   * which category it is.
   * @returns a list of labels for the specified category
   */
  getDisplayedColumns(): string[] {
    const result: string[] = [];

    // Add checkbox for selecting rows
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
            case PeriodWidth.DAY:
              result.push('period_DAY');
              break;
            case PeriodWidth.MONTH:
              result.push('period_MONTH');
              break;
            case PeriodWidth.WEEK:
              result.push('period_WEEK');
              break;
            case PeriodWidth.YEAR:
              result.push('period_YEAR');
              break;
            default:
              result.push('date');
              result.push('time');
          }
        } else {
          if (!this.shouldHide(column)) {
            result.push(column);
          }
        }
      }
      // Add info/edit button
      result.push('dialog');
    }

    return result;
  }
}
