import {Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {CategorySpec, DataPoint, DataTypeCodedText, DataTypeCodedTextOpt, DataTypeEnum} from '../../ehr/ehr-types';
import {Conveyor} from '../../conveyor.service';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {

  categories: string[] = [];
  categorySpecs: Map<string, CategorySpec>;
  dataTypeEnum = DataTypeEnum;

  constructor(private conveyor: Conveyor) {
  }

  ngOnInit() {
    // Reset all the internal lists.
    this.categories = this.conveyor.getCategoryIds();
    this.categorySpecs = new Map<string, CategorySpec>();
    for (const category of this.categories) {
      this.categorySpecs.set(category, this.conveyor.getCategorySpec(category));
    }
  }

  /**
   * Checks if a category is empty.
   * @param categoryId the category to check values from.
   * @returns whether the category has no points in its list.
   */
  isCategoryEmpty(categoryId: string): boolean {
    if (this.conveyor.getDataList(categoryId)) {
      return this.conveyor.getDataList(categoryId).getPoints().length < 1;
    }
    return false;
  }

  /**
   * Get the number of values in a chosen category.
   * @param category the category to get values from
   * @returns the number of values in the chosen category
   */
  getNumberOfValues(category: string) {
    return this.conveyor.getDataList(category).getPoints().length;
  }

  /**
   * Send all the data stored in the conveyor.
   */
  sendData() {
    this.conveyor.sendData().
      subscribe(
        _ => console.log('success'),
        e => console.log(e)
    );
  }

  authenticate(user: string, pass: string): void {
    this.conveyor.authenticateBasic(user, pass);
  }

}
