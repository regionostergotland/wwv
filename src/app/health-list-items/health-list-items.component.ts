import {Component, Input, OnInit} from '@angular/core';
import {DataPoint, DataTypeCodedText, DataTypeCodedTextOpt, DataTypeEnum} from '../shared/spec';
import {Conveyor} from '../conveyor.service';

@Component({
  selector: 'app-health-list-items',
  templateUrl: './health-list-items.component.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class HealthListItemsComponent implements OnInit {

  @Input() selectedCategory: string;

  displayedColumns: string[] = [];
  dataTypeEnum = DataTypeEnum;
  a: number = 1;

  categories: string[] = [];

  static getDate(date: Date): string {
    return date.toLocaleDateString('sv-SE');
  }

  static getTime(date: Date): string {
    return date.toLocaleTimeString('sv-SE');
  }

  constructor(private conveyor: Conveyor) {

    for (const platform of conveyor.getPlatforms()) {
      for (const category of conveyor.getCategories(platform)) {
        this.categories.push(category);
        conveyor.fetchData(platform, category, new Date(), new Date()); // TODO: remove this later
      }
    }
    console.log(this.categories[0]);
  }

  ngOnInit() {
  }

  getData(category: string): DataPoint[] {
    return this.conveyor.getDataList(category).getPoints();
  }

  getlabel(category: string, labelId: string): string {
    if (labelId === 'date') {
      return 'Datum';
    }
    return this.conveyor.getDataList(category).getDataType(labelId).label;
  }

  /*
  * Returns the columns which should be displayed in the table depending on which
  * category it is
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

  getVisualType(category: string, key: string): DataTypeEnum {
    if (key === 'date') {
      return DataTypeEnum.DATE_TIME;
    }
    return this.conveyor.getDataList(category).spec.dataTypes.get(key).type;
  }

  /*
   * Gets the options to choose from according to a DataType.
   * */
  getOptions(category: string, key: string): DataTypeCodedTextOpt[] {
    const datatypes: DataTypeCodedText = this.conveyor.getDataList(category).getDataType(key) as DataTypeCodedText;
    return datatypes.options;
  }

  getPointData(point: DataPoint, key: string): string {
    if (key === 'date') {
      return HealthListItemsComponent.getDate(point.get('time'));
    }
    if (key === 'time') {
      return HealthListItemsComponent.getTime(point.get('time'));
    }
    return point.get(key);
  }

  getNumberOfValues(category: string) {
    return this.conveyor.getDataList(category).getPoints().length;
  }

  setOption(key: string, point: DataPoint, option: string) {
    point.set(key, option);
    this.a = this.a + 1;
    console.log(Array.from(point.keys()));
  }

  setAllOptions(key: string, option: string, category: string) {
    let allData = true;
    for (const point of this.getData(category)) {
      if (!point.has(key)) {
        this.setOption(key, point, option);
        allData = false;
      }
    }
    if (allData) {
      for (const point of this.getData(category)) {
        this.setOption(key, point, option);
      }
    }
  }

}
