
import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../../services/payment.service';
import { IPremiumPlan } from 'src/app/models/premium-plan.model';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.scss']
})


export class PaymentCheckoutComponent implements OnInit {

  $premium: Observable<IPremiumPlan> = new Observable<IPremiumPlan>();
  constructor(
    private http: HttpClient,
    private paymentService: PaymentService
  ) { }


  ngOnInit(): void {
    this.$premium = this.paymentService.getPremium();
  }

  onSubmit(f: NgForm) {
    this.paymentService.requestPremiumSession(f.value.priceId);
  }
}
