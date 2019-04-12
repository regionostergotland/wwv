import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  constructor(private conveyor: Conveyor, private router: Router) {
  }

  ngOnInit() {
  }

  getCurrentStep(): number {
    switch  (this.router.url) {
      case '/sources': {
        return 1;
      }
      case '/pick-categories': {
        return 1;
      }
      case '/edit': {
        return 2;
      }
      case '/inspection': {
        return 3;
      }
      case '/confirmation': {
        return 4;
      }
      default: {
        return 0;
      }
    }
  }

}
