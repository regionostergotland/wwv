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
    this.load = true;
    this.wait();
    this.load = false;
  }

  async wait(): Promise<void> {
    await this.delay(2000);
  }

  async delay(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

}
