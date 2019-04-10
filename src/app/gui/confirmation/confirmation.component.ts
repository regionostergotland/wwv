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

  async wait(): Promise<void> {
    this.load = true;
    await this.delay(2000);
    this.load = false;
  }

  async delay(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

}
