import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintComponent } from './footprint.component';

describe('FootprintComponent', () => {
  let component: FootprintComponent;
  let fixture: ComponentFixture<FootprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
