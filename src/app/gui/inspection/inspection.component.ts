import {Component, OnInit} from '@angular/core';
import {CategorySpec, DataPoint, DataTypeCodedText, DataTypeCodedTextOpt, DataTypeEnum} from '../../ehr/ehr-types';
import {Conveyor} from '../../conveyor.service';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {

  categories: string[] = [];
  categorySpecs: Map<string, CategorySpec>;
  categoryDataPoints: Map<string, DataPoint[]>;
  options: Map<string, Map<string, DataTypeCodedTextOpt[]>>;
  visibleStrings: Map<string, Map<DataPoint, Map<string, string>>>;
  displayedColumns: Map<string, string[]>;

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

  constructor(private conveyor: Conveyor) {
  }

  ngOnInit() {
    // Reset all the internal lists.
    this.categories = this.conveyor.getCategoryIds();
    this.categorySpecs = new Map<string, CategorySpec>();
    this.categoryDataPoints = new Map<string, DataPoint[]>();
    this.options = new Map<string, Map<string, DataTypeCodedTextOpt[]>>();
    this.visibleStrings = new Map<string, Map<DataPoint, Map<string, string>>>();
    this.displayedColumns = new Map<string, string[]>();

    // Fill lists with correct values.
    for (const category of this.categories) {
      // Set all Maps with the category as the key so that it exists.
      this.categorySpecs.set(category, this.conveyor.getCategorySpec(category));
      this.categoryDataPoints.set(category, this.conveyor.getDataList(category).getPoints());
      this.displayedColumns.set(category, this.getDisplayedColumns(category));
      this.visibleStrings.set(category, new Map<DataPoint, Map<string, string>>());

      // Fill all options for drop-downs and the data list with the dataPoints as the keys.
      for (const key of Array.from(this.categorySpecs.get(category).dataTypes.keys())) {
        this.options.set(category, new Map<string, DataTypeCodedTextOpt[]>());

        // Fill all options for the drop-downs of the category
        if (this.categorySpecs.get(category).dataTypes.get(key).type === DataTypeEnum.CODED_TEXT) {
          const datatypes: DataTypeCodedText = this.conveyor.getDataList(category).getDataType(key) as DataTypeCodedText;
          this.options.get(category).set(key, datatypes.options);
        }

        // Fill the data container with strings using the getPointData method.
        for (const dataPoint of this.categoryDataPoints.get(category)) {
          const point = new Map<string, string>();
          for (const column of this.displayedColumns.get(category)) {
            point.set(column, this.getPointData(dataPoint, column, category));
          }
          this.visibleStrings.get(category).set(dataPoint, point);
        }
      }
    }
  }

  /**
   * Get a list of all the DataPoints of a chosen category.
   * @param category the category to get points from
   * @returns a list of all points in the chosen categories
   */
  getData(category: string): DataPoint[] {
    return this.categoryDataPoints.get(category);
  }

  /**
   * Get a list of categories containing data
   * @returns a list of categories containing data from conveyor
   */
  getCategories(): string[] {
    return this.categories;
  }

  /**
   * Checks if a category is empty.
   * @param categoryId the category to check values from.
   * @returns whether the category has no points in its list.
   */
  isCategoryEmpty(categoryId: string): boolean {
    if (this.conveyor.getDataList(categoryId)) {
      return this.conveyor.getDataList(categoryId).getPoints().length < 1;
    }
    return false;
  }

  /**
   * Returns the columns which should be displayed in the table depending on which
   * category it is.
   * @param category the category to get columns from
   * @returns a list of labels for the specified category
   */
  getDisplayedColumns(category: string): string[] {
    const result: string[] = [];
    if (this.getData(category)) {
      for (const column of Array.from(this.conveyor.getDataList(category).spec.dataTypes.keys())) {
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
   * Gets the label of the id specified.
   * @param category category to fetch label from
   * @param labelId the id to fetch the label to
   * @returns a label for the specified id
   */
  getColumnLabel(category: string, labelId: string): string {
    if (labelId === 'date') {
      return 'Datum';
    }
    return this.conveyor.getDataList(category).getDataType(labelId).label;
  }

  /**
   * Gets the data to be displayed from the point
   * @param point the datapoint to get the data from
   * @param key the data category to get
   * @param categoryId the category to fetch from.
   * @returns a string of the value to show
   */
  getPointData(point: DataPoint, key: string, categoryId: string): string {
    if (key === 'date') {
      return InspectionComponent.getDate(point.get('time'));
    }
    if (key === 'time') {
      return InspectionComponent.getTime(point.get('time'));
    }
    if (this.getVisualType(key, categoryId) === DataTypeEnum.CODED_TEXT) {
      const codedText: DataTypeCodedText = this.conveyor.getDataList(categoryId).getDataType(key) as DataTypeCodedText;
      for (const code of codedText.options) {
        if (code.code === point.get(key)) {
          return code.label;
        }
      }
    }
    return point.get(key);
  }

  /**
   * Gets the type to display in the table.
   * @param key the id to get the label from
   * @param categoryId the category to fetch from.
   * @returns the type to display in the table
   */
  getVisualType(key: string, categoryId: string): DataTypeEnum {
    if (key === 'date') {
      return DataTypeEnum.DATE_TIME;
    }
    if (this.conveyor.getDataList(categoryId)) {
      return this.conveyor.getDataList(categoryId).spec.dataTypes.get(key).type;
    }
  }

  /**
   * Get the number of values in a chosen category.
   * @param category the category to get values from
   * @returns the number of values in the chosen category
   */
  getNumberOfValues(category: string) {
    return this.conveyor.getDataList(category).getPoints().length;
  }

  /**
   * Send all the data stored in the conveyor.
   */
  sendData() {
    this.conveyor.sendData().
      subscribe(
        _ => console.log('success'),
        e => console.log(e)
    );
  }

  authenticate(user: string, pass: string): void {
    this.conveyor.authenticateBasic(user, pass);
  }

}
