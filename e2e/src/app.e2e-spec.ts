import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo('home');
    expect(page.getTitleText()).toEqual('Välkommen!');
  });

  it('k2.5: klicka på ta bort data och data tas bort', () => {
    page.navigateTo('platform-selection');
    expect(page.getCardTitleText()).toContain('Google Fit');
  });


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
