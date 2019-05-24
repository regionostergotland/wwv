import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef, MatDialog } from '@angular/material';
import { DataList } from '../../ehr/datalist';
import { AddNewDataModalComponent } from './add-new-data-modal.component';

@Component({
  selector: 'app-bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetCategoriesComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetCategoriesComponent>, private conveyor: Conveyor) {}

  /**
   * Gets a list of the IDs of all categories available.
   * @returns a list of category IDs.
   */
  getAllCategories(): string[] {
    return this.conveyor.getAllCategories();
  }

  /**
   * Gets the description to be displayed of a specific category.
   * @param categoryId id of the category to get from.
   * @returns string description of a category type.
   */
  getCategoryDescription(categoryId: string): string {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).description;
    }
  }

  /**
   * Gets the label to be displayed of a specific category.
   * @param categoryId id of the category to get from.
   * @returns string label of a category.
   */
  getCategoryLabel(categoryId: string): string {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).label;
    }
  }

  /**
   * Gets the icon of a specific category to display on the page.
   * @param categoryId id of the category to get from.
   * @returns the project path to the icon image.
   */
  getCategoryIcon(categoryId: string): string {
    const baseUrl = '../../assets/flaticon/';
    return baseUrl + this.conveyor.getCategorySpec(categoryId).id + '.png';
  }

  /**
   * If the user selects a category, it is added to the conveyor and a new datalist is created.
   * @param event MouseEvent object contains information about user click.
   * @param categoryId the string ID of the user-selected category.
   */
  addCategory(event: MouseEvent, categoryId: string): void {
    if (!this.conveyor.hasCategoryId(categoryId)) {
      this.conveyor.setDataList(categoryId, new DataList(this.conveyor.getCategorySpec(categoryId)));
    }
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {

  title = 'Kategorier';
  selectedCategory: string = null;
  selectedColor = '#e7e7e7';
  showFiller = false;

  constructor(private conveyor: Conveyor, private router: Router, private bottomSheet: MatBottomSheet, public dialog: MatDialog) {

  }

  openAddNewDataModal(): void {
    const dialogRef = this.dialog.open(AddNewDataModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'app') {
        this.router.navigateByUrl('/platform-selection');
      } else if (result === 'category') {
        this.openBottomSheet();
      }
    });
  }

  ngOnInit() {
  }

  getMode(): string {
    // lt-md / lt-sm
    if (window.matchMedia('(max-width: 959px)').matches) {
        return 'bottom';
    }

    return 'side';
  }

  getContainerClass(): string {
    if (this.getMode() === 'side') {
      return 'content-container border';
    }

    return 'content-container';
  }

  selectCategory(category: string): void {
      this.selectedCategory = category;
  }

  /**
   * Gets a list of the IDs of all categories available in the conveyor.
   * @returns a list of category IDs.
   */
  getUserCategories(): string[] {
    return this.conveyor.getCategoryIds();
  }

  /**
   * Gets the label of a specific category to display on the page.
   * @param categoryId id of the category to get from.
   * @returns the category label.
   */
  getCategoryLabel(categoryId: string): string {
      return this.conveyor.getCategorySpec(categoryId).label;
  }

  /**
   * Gets the icon of a specific category to display on the page.
   * @param categoryId id of the category to get from.
   * @returns the project path to the icon image.
   */
  getCategoryIcon(categoryId: string): string {
    const baseUrl = '../../assets/flaticon/';
    return baseUrl + this.conveyor.getCategorySpec(categoryId).id + '.png';
  }

  /**
   * Return the color of the selected category and return an empty string if no category is selected.
   * @returns hex value of background color or empty string.
   */
  getTitleSelected(): string {
    return this.selectedCategory === null ? this.selectedColor : '';
  }

  /**
   * Gets the background color to be displayed for the category-list.
   * @param categoryId id of the category to get from.
   * @returns hex value of background color.
   */
  getBackgroundColor(categoryId: string): string {
    if (categoryId === this.selectedCategory) {
      return this.selectedColor;
    }
    return '';
  }

  /**
   * Opens the pop-up menu for selecting a new category.
   */
  openBottomSheet(): void {
// tslint:disable-next-line: no-use-before-declare
    this.bottomSheet.open(BottomSheetCategoriesComponent);
  }
}
