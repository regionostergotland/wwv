import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  title = 'Kategorier';
  selectedCategory: string;

  userCategories: string[] = [
    'Blood pressure',
    'Weight',
    'Steps'
  ];

  constructor() { }

  ngOnInit() {
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }


}
