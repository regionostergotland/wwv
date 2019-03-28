import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];

  addMsg(message: string) {
    this.messages.push(message);
  }

  clearMessages() {
    this.messages = [];
  }

  constructor() { }
}
