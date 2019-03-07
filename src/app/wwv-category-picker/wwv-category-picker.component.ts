import { Component, OnInit } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatCheckbox } from '@angular/material';

@Component({
  selector: 'app-wwv-category-picker',
  templateUrl: './wwv-category-picker.component.html',
  styleUrls: ['./wwv-category-picker.component.scss']
})
export class WwvCategoryPickerComponent implements OnInit {

  chosenCategories: string[] = [];
  startDate: Date;
  endDate: Date;

  constructor(private adapter: DateAdapter<any>) {
    this.adapter.setLocale('sv');
  }

  ngOnInit() {
  }

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

  /*
  * connected to the category checkboxes
  * */
  updateChosenCategories(category: string, event): void {
    let boxChecked: boolean = event.checked;

    if (boxChecked) {
      this.chosenCategories.push(category);  
    }
    else {
      this.chosenCategories.splice(this.chosenCategories.indexOf(category), 1);
    }

    console.log(this.chosenCategories.toString());
  }

}
