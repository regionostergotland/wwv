import { Component, OnInit, Input } from '@angular/core';
import { NgModule }             from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  title = "Kategorier";

  userCategories: string[] = [
    'blood pressure',
    'weight',
    'steps'
  ];

  constructor() { }

  ngOnInit() {
  }


}
