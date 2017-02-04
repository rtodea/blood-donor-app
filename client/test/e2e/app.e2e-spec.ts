import { Angular2cliAppPage } from './app.po';

describe('angular2cli-app App', function() {
  let page: Angular2cliAppPage;

  beforeEach(() => {
    page = new Angular2cliAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Blood Donors App');
  });
});
