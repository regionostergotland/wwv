import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  /**
   * Checks for the current step in the app-progress through the url
   * @returns a number of the current step in the progress
   */
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
