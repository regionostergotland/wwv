import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(url: string) {
    return browser.get(browser.baseUrl + '/' + url) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getCardTitleText() {
    return element(by.tagName('mat-card-title')).getText() as Promise<string>;
  }


  getElementByCss(type: string) {
    return element(by.css(type)).getText() as Promise<string>;
  }
}
