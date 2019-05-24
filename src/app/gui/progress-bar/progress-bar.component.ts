import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit() {}

  onSmallScreen(): boolean {
    return window.matchMedia('(max-width: 599px)').matches;
  }

  /**
   * @param buttonStep what step the button corresponds to.
   * @returns css classes that should be applied to button
   */
    getClass(buttonStep: number): string {
      const step = this.getCurrentStep();
      if (buttonStep === step) {
        return 'dot active';
      } else if (step > buttonStep) {
        return 'dot done';
      }
      return 'dot';
    }

  /**
   *
   * @param to path to navigate to
   * @param buttonStep what step the button button pressed corresponds to.
   */
  navigate(to: string, buttonStep: number): void {
    if (buttonStep !== this.getCurrentStep() && to !== '') {
      this.router.navigateByUrl('/' + to);
    }
  }

  /**
   * Checks for the current step in the app-progress through the url
   * @returns a number of the current step in the progress
   */
  getCurrentStep(): number {
    switch (this.router.url.split('/')[1]) {
      case 'platform-selection':
      case 'category-selection':
        return 1;
      case 'edit':
        return 2;
      case 'inspection':
        return 3;
      default: {
        return 0;
      }
    }
  }
}
