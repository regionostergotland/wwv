import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';
export class HomePage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getSourcesButton(): ElementFinder {
    return element(by.css('#home-nav-src'));
  }

  getHelpButton(): ElementFinder {
    return element(by.css('#home-nav-help'));
  }

  getManualInputButton(): ElementFinder {
    return element(by.css('#home-nav-input'));
  }
}
