import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';

export interface BloodPressure {
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
  sittingLying: string;
}

export interface Weight {
  date: string;
  time: string;
}

const BP_DATA: BloodPressure[] = [
  {systolic: 120, diastolic: 80, date: '2019-10-02', time: '13:00', sittingLying: 'sittande'},
  {systolic: 110, diastolic: 90, date: '2019-10-06', time: '15:00', sittingLying: 'sittande'},
  {systolic: 120, diastolic: 80, date: '2019-10-02', time: '19:45', sittingLying: 'liggande'},
  {systolic: 140, diastolic: 100, date: '2019-10-07', time: '13:00', sittingLying: 'liggande'},
  {systolic: 100, diastolic: 60, date: '2018-02-05', time: '17:00', sittingLying: 'sittande'},
  {systolic: 120, diastolic: 80, date: '2019-10-02', time: '14:30', sittingLying: 'liggande'},
];

const WEIGHT_DATA: Weight[] = [
  {date: '2019-01-10', time: '13:30'},
  {date: '2002-01-10', time: '15:00'},
  {date: '2011-11-23', time: '17:30'}
];

const BPCOLS: string[] = ['systolic', 'diastolic', 'date', 'time', 'sittingLying'];
const WeightCOLS: string[] = ['date', 'time'];

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {

  categories: string[] = ['blood pressure', 'weight'];

  displayedColumns: string[] = BPCOLS;
  dataSource = BP_DATA;

  constructor() { }

  ngOnInit() {
  }

}
