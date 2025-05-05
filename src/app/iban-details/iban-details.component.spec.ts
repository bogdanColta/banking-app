import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbanDetailsComponent } from './iban-details.component';

describe('IbanDetailsComponent', () => {
  let component: IbanDetailsComponent;
  let fixture: ComponentFixture<IbanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IbanDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
