import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Conveyor} from '../conveyor.service';
import {DataPoint, DataTypeCodedText, DataTypeCodedTextOpt, DataTypeEnum, DataTypeQuantity} from '../shared/spec';
import { AmazingTimePickerService } from 'amazing-time-picker';


@Component({
  selector: 'app-add-data-point',
  templateUrl: './add-data-point.component.html',
  styleUrls: ['./add-data-point.component.scss']
})
export class AddDataPointComponent implements OnInit {

  selectedCategory: string;
  dataTypeEnum = DataTypeEnum;
  pointData: Map<string, any>;
  clockTime: string;

  constructor(
    public dialogRef: MatDialogRef<AddDataPointComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private conveyor: Conveyor,
    private atp: AmazingTimePickerService) {
    this.selectedCategory = data;
    this.pointData = new Map<string, any>();
    this.clockTime = '19:00';
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Gets all data points from the facade
   * @returns a list of all datapoints in the category
   */
  getData(): DataPoint[] {
    return this.conveyor.getDataList(this.selectedCategory).getPoints();
  }

  /**
   * Returns the columns which should be displayed in the table depending on which
   * category it is.
   * @returns a list of labels for the specified category
   */
  getDisplayedColumns(): string[] {
    const result: string[] = [];
    if (this.getData()) {
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
   * Gets the label of the id specified.
   * @param labelId the id to fetch the label to
   * @returns a label for the specified id
   */
  getLabel(labelId: string): string {
    if (labelId === 'date') {
      return 'Datum';
    }
    if (!this.pointData.has(labelId)) {
      if (this.getVisualType(labelId) === DataTypeEnum.DATE_TIME) {
        this.pointData.set(labelId, new Date());
      } else {
        this.pointData.set(labelId, '');
      }
    }
    return this.conveyor.getDataList(this.selectedCategory).getDataType(labelId).label;
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
    return this.conveyor.getDataList(this.selectedCategory).spec.dataTypes.get(key).type;
  }

  /**
   * Gets the options to choose from according to a DataType.
   * @param key the id to to fetch the options from
   * @returns a list of options
   */
  getOptions(key: string): DataTypeCodedTextOpt[] {
    const datatypes: DataTypeCodedText = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeCodedText;
    return datatypes.options;
  }

  getMinOfRange(key: string): number {
    const datatype: DataTypeQuantity = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeQuantity;
    return datatype.magnitudeMin;
  }

  getMaxOfRange(key: string): number {
    const datatype: DataTypeQuantity = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeQuantity;
    return datatype.magnitudeMax;
  }

  createDataPoint() {
    console.log(this.pointData);
    for (const [typeId, value] of this.pointData.entries()) {
      if (!this.conveyor.getCategorySpec(this.selectedCategory).dataTypes.get(typeId).isValid(value)) {
        return;
      }
    }
    const dataPoint: DataPoint = new DataPoint();
    for (const data of Array.from(this.pointData.keys())) {
      dataPoint.set(data, this.pointData.get(data));
    }
    this.conveyor.getDataList(this.selectedCategory).addPoint(dataPoint);
    this.dialogRef.close();
  }

  setTime(time: string) {
    console.log(time);
    this.clockTime = time;
    const date: Date = this.pointData.get('time') as Date;
    const strs = time.split(':');
    date.setHours(+strs[0]);
    date.setMinutes(+strs[1]);
    this.pointData.set('time', date);
  }

  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.setTime(time);
    });
  }
}
