import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Observable, forkJoin } from 'rxjs';
import { Conveyor } from '../../conveyor.service';
import { CategorySpec } from '../../ehr/datatype';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss']
})

export class CategorySelectionComponent implements OnInit {

  constructor(private adapter: DateAdapter<any>,
              private conveyor: Conveyor,
              private route: ActivatedRoute,
              public router: Router) {
    this.adapter.setLocale('sv');
  }

  chosenCategories: string[] = [];
  categories: [string, string][] = [];
  categoryIds: string[] = [];

  startDate: Date;
  endDate: Date;

  private platformId = '';

  allChosen = false; // True if all categories have been chosen

  // Map  containing the categoryId:s and whether they have been chosen or not
  categoryMap: Map<string, boolean>;

  ngOnInit() {
    this.platformId = this.route.snapshot.paramMap.get('platform');

    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.endDate = new Date();

    this.categoryMap = new Map<string, boolean>();

    // Is there a platform
    if (this.platformId) {
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
      this.categoryMap.set(id, false);
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
   * @param event The checkbox event
   */
  updateChosenCategories(category: string, event: any): void {
    const boxChecked: boolean = event.checked;
    this.categoryMap.set(category, boxChecked);
    if (boxChecked) {
      // Add to the chosen categories as long as it isn't already chosen
      if (this.chosenCategories.indexOf(category) === -1) {
        this.chosenCategories.push(category);
      }
      // If all available categories are chosen, make the 'select all'
      // checkbox checked
      if (this.chosenCategories.length === this.categories.length) {
        this.allChosen = true;
      }
    } else {
      // As long as at least one category is unchecked, allChosen should be
      // false
      this.allChosen = false;
      // Remove the category from chosenCategories
      this.chosenCategories.splice(this.chosenCategories.indexOf(category), 1);
    }
  }

  /**
   * Selects/deselects all categories depending on the checkbox event
   * @param event The checkbox event
   */
  updateAllCategories(event: any) {
    for (const category of this.categories) {
      this.updateChosenCategories(category[0], event);
    }
  }

  /**
   * Checks if the dates are in a valid interval and 1 or more categories is
   * selected
   * @returns Boolean for valid/invalid selections
   */
  validateSelections(): boolean {
    return (this.startDate &&
            this.endDate &&
            this.chosenCategories.length > 0);
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
    forkJoin(fetches).subscribe(_ => this.router.navigateByUrl('/edit'));
  }
}
