import { Component, OnInit } from '@angular/core';
import {DateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.scss']
})
export class CategoryPickerComponent implements OnInit {

  constructor(private adapter: DateAdapter<any>) {
    this.adapter.setLocale('sv');
  }

  chosenCategories: string[] = [];
  startDate: Date;
  endDate: Date;

  categories: string[] = [
    'blood pressure',
    'weight',
    'steps',
    'blood sugar',
    'something else',
    'blood pressure',
    'weight',
    'steps',
    'blood sugar',
    'something else',
    'blood pressure',
    'weight',
    'steps',
    'blood sugar',
    'something else',
    'blood pressure',
    'weight',
    'steps',
    'blood sugar',
    'something else',
    'blood pressure',
    'weight',
    'steps',
    'blood sugar',
    'something else'
  ];

  ngOnInit() {
  }

  /*
  * connected to the category checkboxes
  * */
  updateChosenCategories(category: string, event): void {
    const boxChecked: boolean = event.checked;

    if (boxChecked) {
      this.chosenCategories.push(category);
    } else {
      this.chosenCategories.splice(this.chosenCategories.indexOf(category), 1);
    }

    console.log(this.chosenCategories.toString());
  }

}
