import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  load: boolean;

  constructor() {
    this.load = true;
  }

  ngOnInit() {
    this.wait();
  }

  /**
   * Timer for spinner to load
   */
  async wait(): Promise<void> {
    this.load = true;
    await this.delay(1500);
    this.load = false;
  }

  /**
   * Waits for a set amount of milliseconds.
   * @param Number of milliseconds to wait.
   * @returns Promise to be fullfilled before continuing.
   */
  async delay(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

}
