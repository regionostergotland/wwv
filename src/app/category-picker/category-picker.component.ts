import { Component, OnInit } from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import { Conveyor } from '../conveyor.service';
import { EhrService } from '../ehr.service';
import { CategorySpec } from '../shared/spec';

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.scss']
})

export class CategoryPickerComponent implements OnInit {

  constructor(private adapter: DateAdapter<any>, private conveyor: Conveyor, private ehrService: EhrService) {
    this.adapter.setLocale('sv');
  }

  chosenCategories: string[] = [];
  categories: [string, string][] = [];
  categoryIds: string[] = [];
  startDate: Date;
  endDate: Date;

  // categories: string[] = [
  //   'blood pressure',
  //   'weight',
  //   'steps',
  //   'blood sugar',
  //   'something else',
  //   'blood pressure',
  //   'weight',
  //   'steps',
  //   'blood sugar',
  //   'something else',
  //   'blood pressure',
  //   'weight',
  //   'steps',
  //   'blood sugar',
  //   'something else',
  //   'blood pressure',
  //   'weight',
  //   'steps',
  //   'blood sugar',
  //   'something else',
  //   'blood pressure',
  //   'weight',
  //   'steps',
  //   'blood sugar',
  //   'something else'
  // ];

  ngOnInit() {
    this.categoryIds = this.conveyor.getCategories('google-fit');
    this.getCategories();
  }

  /**
   * Adds all category labels together with the ids, in a list.
   */
  getCategories() {
    let cat: CategorySpec;
    for (const entry of this.categoryIds) {
      cat = this.ehrService.getCategorySpec(entry);
      this.categories.push([entry, cat.label]);
    }
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
