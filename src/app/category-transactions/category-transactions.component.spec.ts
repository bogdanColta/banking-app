import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTransactionsComponent } from './category-transactions.component';

describe('CategoryTransactionsComponent', () => {
  let component: CategoryTransactionsComponent;
  let fixture: ComponentFixture<CategoryTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
