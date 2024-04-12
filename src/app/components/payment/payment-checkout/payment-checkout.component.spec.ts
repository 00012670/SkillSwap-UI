import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCheckoutComponent } from './payment-checkout.component';

describe('PaymentCheckoutComponent', () => {
  let component: PaymentCheckoutComponent;
  let fixture: ComponentFixture<PaymentCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCheckoutComponent]
    });
    fixture = TestBed.createComponent(PaymentCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
