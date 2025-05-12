import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintTransactionsComponent } from './footprint-transactions.component';

describe('FootprintTransactionsComponent', () => {
  let component: FootprintTransactionsComponent;
  let fixture: ComponentFixture<FootprintTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootprintTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootprintTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
