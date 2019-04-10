import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Observable, forkJoin } from 'rxjs';
import { Conveyor } from '../../conveyor.service';
import { CategorySpec } from '../../ehr/ehr-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.scss']
})

export class CategoryPickerComponent implements OnInit {

  constructor(private adapter: DateAdapter<any>, private conveyor: Conveyor, private router: Router) {
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

    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.endDate = new Date();

    // finns det en platform
    if (this.platformId) {
      // this.conveyor.getCategories(this.platformId).subscribe(_ => {
      this.conveyor.getAvailableCategories(this.platformId).subscribe(res => {
        this.categoryIds = res;
        this.getCategories();
      });
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

  /**
   * Returns the description of a category
   * @param categoryId the ID of the category
   */
  getDescription(categoryId: string) {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).description;
    }
  }

  /**
   * connected to the category checkboxes
   * @param category The category to update
   * @param event the checkbox event
   */
  updateChosenCategories(category: string, event: any): void {
    const boxChecked: boolean = event.checked;
    if (boxChecked) {
        this.chosenCategories.push(category);
    } else {
        this.chosenCategories.splice(this.chosenCategories.indexOf(category), 1);
    }

  }
  validateSelections(): boolean {
    return (this.startDate && this.endDate && this.chosenCategories.length > 0);
  }

  /**
   * Gets data from conveyor.
   */
  getData() {
    const fetches: Observable<any>[] = this.chosenCategories
      .map(cat =>
        this.conveyor.fetchData(this.platformId, cat,
                                this.startDate, this.endDate));
    this.chosenCategories = [];
    forkJoin(fetches).subscribe(_ => this.router.navigateByUrl('/sidebar'));
  }
}
