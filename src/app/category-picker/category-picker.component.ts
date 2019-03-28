import { Component, OnInit } from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import { Conveyor } from '../conveyor.service';
import { CategorySpec } from '../shared/spec';

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.scss']
})

export class CategoryPickerComponent implements OnInit {

  constructor(private adapter: DateAdapter<any>, private conveyor: Conveyor) {
    this.adapter.setLocale('sv');
  }

  chosenCategories: string[] = [];
  categories: [string, string][] = [];
  categoryIds: string[] = [];
  startDate: Date;
  endDate: Date;
  private platformId = '';

  ngOnInit() {
    this.platformId = this.conveyor.getSelectedPlatform();

    // finns det en platform
    if (this.platformId) {
      this.categoryIds = this.conveyor.getCategories(this.platformId);
      this.getCategories();
    }
  }

  /**
   * Adds all category labels together with the ids, in a list.
   */
  getCategories() {
    let cat: CategorySpec;
    for (const id of this.categoryIds) {
      cat = this.conveyor.getCategorySpec(id);
      this.categories.push([id, cat.label]);
    }
  }

  /*
  * connected to the category checkboxes
  * */
  updateChosenCategories(category: string, event): void {
    const boxChecked: boolean = event.checked;
    if (boxChecked) {
        this.conveyor.selectCategory(category);
    } else {
        this.conveyor.unSelectCategory(category);
    }
    console.log(this.conveyor.getSelectedCategories());
  }

  validateSelections(): boolean {
      return(this.startDate && this.endDate && this.conveyor.getSelectedCategories().length > 0);
  }


}
