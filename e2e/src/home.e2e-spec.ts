import { HomePage } from './home.po';
import { browser, logging } from 'protractor';


describe('workspace-project App', () => {
  const page = new HomePage();
  beforeEach(() => {
    page.navigateTo();
  });

  it('should display welcome message', () => {
    expect(page.getTitleText()).toEqual('Välkommen!');
  });

  it('Should redirect to the help page when help is clicked', () => {
    const help = page.getHelpButton();
    help.click();
    expect(browser.driver.getCurrentUrl()).toContain('/help');
  });

  it(`Should redirect to the platform selection page when sources button is
    clicked`, () => {
    const src = page.getSourcesButton();
    src.click();
    expect(browser.driver.getCurrentUrl()).toContain('/platform-selection');
  });

  it(`Should redirect to the manual input page when the manual input button
    is clicked'`, () => {
    const input = page.getManualInputButton();
    input.click();
    expect(browser.driver.getCurrentUrl()).toContain('/edit');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
    level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
