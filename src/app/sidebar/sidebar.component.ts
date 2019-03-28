import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { Conveyor } from '../conveyor.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  title = 'Kategorier';
  selectedCategory: string;

  userCategories: string[];

  constructor(private conveyor: Conveyor) {

  }

  ngOnInit() {
      this.userCategories = this.conveyor.getSelectedCategories();
  }

  selectCategory(category: string): void {
      this.selectedCategory = category;
  }

  getCategoryLabel(categoryId: string): string {
      return this.conveyor.getCategorySpec(categoryId).label;
  }


}
