import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { DataList } from '../../ehr/ehr-types';

@Component({
  selector: 'app-bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetCategoriesComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetCategoriesComponent>, private conveyor: Conveyor) {}

  getAllCategories(): string[] {
    return this.conveyor.getAllCategories();
  }

  getCategoryDescription(categoryId: string): string {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).description;
    }
  }

  getCategoryLabel(categoryId: string): string {
    if (this.conveyor.getCategorySpec(categoryId)) {
      return this.conveyor.getCategorySpec(categoryId).label;
    }
  }

  addCategory(event: MouseEvent, categoryId: string): void {
    if (!this.conveyor.hasCategoryId(categoryId)) {
      this.conveyor.setDataList(categoryId, new DataList(this.conveyor.getCategorySpec(categoryId)));
    }
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  title = 'Kategorier';
  selectedCategory: string;

  constructor(private conveyor: Conveyor, private router: Router, private bottomSheet: MatBottomSheet) {

  }

  ngOnInit() {
  }

  selectCategory(category: string): void {
      this.selectedCategory = category;
  }

  getUserCategories(): string[] {
    return this.conveyor.getCategoryIds();
  }

  getCategoryLabel(categoryId: string): string {
      return this.conveyor.getCategorySpec(categoryId).label;
  }

  openBottomSheet(): void {
// tslint:disable-next-line: no-use-before-declare
    this.bottomSheet.open(BottomSheetCategoriesComponent);
  }
}
