import { Component, OnInit } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-wwv-category-picker',
  templateUrl: './wwv-category-picker.component.html',
  styleUrls: ['./wwv-category-picker.component.css']
})
export class WwvCategoryPickerComponent implements OnInit {

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

}
