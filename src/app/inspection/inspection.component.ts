import { Component, OnInit } from '@angular/core';
import { DataList, DataPoint } from '../shared/spec';
import { Conveyor } from '../conveyor.service';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {

  categories: string[] = [];

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

    for (let platform of conveyor.getPlatforms()) {
      for (let category of conveyor.getCategories(platform)) {
        this.categories.push(category);
      }
    }

  }

  ngOnInit() {
  }

  getLabel(category: string): string {
    return this.conveyor.getCategorySpec(category).label;
  }

  getData(category: string): DataPoint[] {
    return this.conveyor.getDataList(category).getPoints();
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
   * @returns a string of the value to show
   */
  getPointData(point: DataPoint, key: string): string {
    if (key === 'date') {
      return InspectionComponent.getDate(point.get('time'));
    }
    if (key === 'time') {
      return InspectionComponent.getTime(point.get('time'));
    }
    return point.get(key);
  }

  getNumberOfValues(category: string) {
    return this.conveyor.getDataList(category).getPoints().length;
  }

  sendData() {
    this.conveyor.sendData();
  }

}
