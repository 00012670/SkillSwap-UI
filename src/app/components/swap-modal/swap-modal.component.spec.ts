import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapModalComponent } from './swap-modal.component';

describe('SwapModalComponent', () => {
  let component: SwapModalComponent;
  let fixture: ComponentFixture<SwapModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwapModalComponent]
    });
    fixture = TestBed.createComponent(SwapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
