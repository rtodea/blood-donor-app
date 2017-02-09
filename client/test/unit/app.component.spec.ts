import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from '../../src/app/app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [ RouterTestingModule ]
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
  });
});
