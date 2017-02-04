import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from '../../src/app/app.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  describe('app title', () => {
    const expectedTitle = 'Blood Donors App';
    let fixture;

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
    });

    it('should have title meta', () => {
      const app = fixture.debugElement.componentInstance;
      expect(app.title).toEqual(expectedTitle);
    });

    it('should have title in h1 tag', () => {
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain(expectedTitle);
    });
  });
});
