import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsuccessfulTransactionComponent } from './unsuccessful-transaction.component';

describe('UnsuccessfulTransactionComponent', () => {
  let component: UnsuccessfulTransactionComponent;
  let fixture: ComponentFixture<UnsuccessfulTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsuccessfulTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsuccessfulTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
