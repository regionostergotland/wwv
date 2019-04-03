import {Component, Input, OnInit} from '@angular/core';
import {CategorySpec, DataPoint, DataTypeCodedText, DataTypeCodedTextOpt, DataTypeEnum} from '../../ehr/ehr-types';
import {Conveyor} from '../../conveyor.service';
import {AddDataPointComponent} from '../add-data-point/add-data-point.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-health-list-items',
  templateUrl: './health-list-items.component.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class HealthListItemsComponent implements OnInit {

  selectedCategory: string;

  @Input() set selectCategory(value: string) {
    this.selectedCategory = value;
    this.ngOnInit();
  }

  dataTypeEnum = DataTypeEnum;
  categorySpec: CategorySpec;
  pointDataList: DataPoint[];
  displayedColumns: string[];
  options: Map<string, DataTypeCodedTextOpt[]>;
  data: Map<DataPoint, Map<string, string>>;

  /**
   * Gets a string representation of the date correctly formatted to be read by a human.
   * @param date the date to format
   * @returns a formatted string representing a date
   */
  static getDate(date: Date): string {
    return date.toLocaleDateString('sv-SE');
  }

  /**
   * Gets a string representation of the time correctly formatted to be read by a human.
   * @param date the date to get the time from to format
   * @returns a formatted string representing a time
   */
  static getTime(date: Date): string {
    return date.toLocaleTimeString('sv-SE', {hour: '2-digit', minute: '2-digit'});
  }

  constructor(private conveyor: Conveyor, public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.selectedCategory) {
      this.categorySpec = this.conveyor.getCategorySpec(this.selectedCategory);
      this.pointDataList = this.conveyor.getDataList(this.selectedCategory).getPoints();
      this.displayedColumns = this.getDisplayedColumns();
      this.options = new Map<string, DataTypeCodedTextOpt[]>();
      this.data = new Map<DataPoint, Map<string, string>>();
      for (const key of Array.from(this.categorySpec.dataTypes.keys())) {
        if (this.categorySpec.dataTypes.get(key).type === DataTypeEnum.CODED_TEXT) {
          const datatypes: DataTypeCodedText = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeCodedText;
          this.options.set(key, datatypes.options);
        }
        for (const dataPoint of this.pointDataList) {
          const point = new Map<string, string>();
          for (const column of this.displayedColumns) {
            point.set(column, this.getPointData(dataPoint, column));
          }
          this.data.set(dataPoint, point);
        }
      }
    }
    console.log(this.options);
  }

  trackItem(index, item) {
    console.log(item);
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
      console.log(this.pointDataList);
    });
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
    if (this.selectedCategory) {
      for (const column of Array.from(this.conveyor.getDataList(this.selectedCategory).spec.dataTypes.keys())) {
        if (column === 'time') {
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
   * Gets the type to display in the table.
   * @param key the id to get the label from
   * @returns the type to display in the table
   */
  getVisualType(key: string): DataTypeEnum {
    if (key === 'date') {
      return DataTypeEnum.DATE_TIME;
    }
    if (this.categorySpec) {
      return this.categorySpec.dataTypes.get(key).type;
    }
  }

  /**
   * Gets the options to choose from according to a DataType.
   * @param key the id to to fetch the options from
   * @returns a list of options
   */
  getOptions(key: string): DataTypeCodedTextOpt[] {
    if (this.conveyor.getDataList(this.selectedCategory)) {
      const datatypes: DataTypeCodedText = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeCodedText;
      return datatypes.options;
    }
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

  /**
   * Sets the data category in the dataPoint to the set option
   * @param key the data category to set
   * @param point the point to set data in
   * @param option the option to set
   */
  setOption(key: string, point: DataPoint, option: string) {
    point.set(key, option);
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
        this.setOption(key, point, option);
        allData = false;
      }
    }
    if (allData) {
      for (const point of this.getData()) {
        this.setOption(key, point, option);
      }
    }
  }

  /**
   * Gets the option of the chosen DataPoint with the given key.
   * @param point the DataPoint to get the option from.
   * @param key the key in the DataPoint to get the option from.
   * @returns A string representation of the option.
   */
  getOption(point: DataPoint, key: string): string {
    if (!point.get(key)) {
      point.set(key, '');
    }
    return point.get(key);
  }

  /**
   * Get the text of the DataPoint from the given key.
   * @param point the point to get text from.
   * @param key The identifier to get the text from.
   * @returns A string of the DataPoint and the key.
   */
  getText(point: DataPoint, key: string): string {
    if (!point.get(key)) {
      return '';
    }
    return point.get(key);
  }

}
