import { MomentumTablePage } from './app.po';

describe('momentum-table App', () => {
  let page: MomentumTablePage;

  beforeEach(() => {
    page = new MomentumTablePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
