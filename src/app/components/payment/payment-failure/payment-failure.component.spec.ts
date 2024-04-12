import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFailureComponent } from './payment-failure.component';

describe('PaymentFailureComponent', () => {
  let component: PaymentFailureComponent;
  let fixture: ComponentFixture<PaymentFailureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentFailureComponent]
    });
    fixture = TestBed.createComponent(PaymentFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
