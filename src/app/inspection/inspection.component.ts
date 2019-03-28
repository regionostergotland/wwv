import { Component, OnInit } from '@angular/core';
import { DataList, DataPoint } from '../shared/spec';
import { Conveyor } from '../conveyor.service';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {

  categories: string[] = [];

  constructor(private conveyor: Conveyor) { 
  
    for (let platform of conveyor.getPlatforms()) {
      for (let category of conveyor.getCategories(platform)) {
        this.categories.push(category);
        conveyor.fetchData(platform, category, new Date(), new Date()); //TODO: remove this later
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

  getDate(date: Date): string {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day =  date.getDate();
    return (day + '/' + month + '/' + year);
  }

  getTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      return (hours + ':0' + minutes);
    } else {
      return (hours + ':' + minutes);
    }
  }

  /*
  * Returns the columns which should be displayed in the table depending on which
  * category it is
  */
  getDisplayedColumns(category: string): string[] {
    let result: string[] = [];
    switch (category) {
      case 'blood-pressure': 
        result = ['systolic', 'diastolic', 'date', 'time', 'position'];
        break;
      default: 
        result = [];
    }
    return result; 
  }

  getNumberOfValues(category: string) {
    return this.conveyor.getDataList(category).getPoints().length;
  }

  sendData() {
    this.conveyor.sendData();
  }

}
