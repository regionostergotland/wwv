import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Conveyor} from '../conveyor.service';
import {DataPoint, DataTypeCodedText,
        DataTypeCodedTextOpt, DataTypeEnum,
        DataTypeQuantity} from '../ehr/ehr-types';
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

  /**
   * The method to be fired when the dialog isn't clicked on but something else is clicked.
   */
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

  /**
   * Gets the minimum of a range of a DataTypeQuantity.
   * @param key the key of the datatype to be fetched.
   * @returns The minimum number accepted of the DataTypeQuantity.
   */
  getMinOfRange(key: string): number {
    const datatype: DataTypeQuantity = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeQuantity;
    return datatype.magnitudeMin;
  }

  /**
   * Gets the maximum of a range of a DataTypeQuantity.
   * @param key the key of the datatype to be fetched.
   * @returns The maximum number accepted of the DataTypeQuantity.
   */
  getMaxOfRange(key: string): number {
    const datatype: DataTypeQuantity = this.conveyor.getDataList(this.selectedCategory).getDataType(key) as DataTypeQuantity;
    return datatype.magnitudeMax;
  }

  /**
   * Creates a DataPoint and adds it to the DataList with all the components of this DialogComponent, if the values are not accepted as
   * an input the value will not save and the dialog will not close.
   */
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

  /**
   * Sets the time of the DataType. This is the only exception to the DataType, as the key 'time' will be split into two, a 'date' and a
   * 'time'. The 'date' will be saved separately and the 'time' will be added into the 'date'. When saved into the DataType, the Date object
   * in 'date' will be saved in 'time'.
   * @param time the time to set.
   */
  setTime(time: string) {
    console.log(time);
    this.clockTime = time;
    const date: Date = this.pointData.get('time') as Date;
    const strs = time.split(':');
    date.setHours(+strs[0]);
    date.setMinutes(+strs[1]);
    this.pointData.set('time', date);
  }

  /**
   * Open the time picker to choose a time.
   */
  openTimePicker() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.setTime(time);
    });
  }

  /**
   * Gets the label of the category.
   * @returns A human readable string of the label of the category.
   */
  getCategoryLabel() {
    return this.conveyor.getCategorySpec(this.selectedCategory).label;
  }
}
