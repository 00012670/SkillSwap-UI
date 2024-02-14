import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapRequestComponent } from './swap-request.component';

describe('SwapRequestComponent', () => {
  let component: SwapRequestComponent;
  let fixture: ComponentFixture<SwapRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwapRequestComponent]
    });
    fixture = TestBed.createComponent(SwapRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
