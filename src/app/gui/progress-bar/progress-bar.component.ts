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

  onSmallScreen(): boolean {
    return window.matchMedia('(max-width: 599px)').matches;
  }

  getClass(index: number): string {
    const step = this.getCurrentStep();
    if (index === step) {
      return 'dot active';
    } else if (step > index) {
      return 'dot done';
    }
    return 'dot';
  }

  navigate(to: string, index: number): void {
    if (index !== this.getCurrentStep() && to !== '') {
      this.router.navigateByUrl('/' + to);
    }
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
