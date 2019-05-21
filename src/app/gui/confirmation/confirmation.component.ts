import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  compUid: string;

  constructor() {}

  ngOnInit() {
    this.compUid = new URL(window.location.href).searchParams.get('compUid');
  }
}
