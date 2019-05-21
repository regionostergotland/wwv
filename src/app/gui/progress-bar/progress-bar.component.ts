import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  constructor(private conveyor: Conveyor, private router: Router) {}
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
  ngOnInit() {}
  getCurrentStep(): number {
    switch (this.router.url) {
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
      default: {
        return 0;
      }
    }
  }
}
