import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { IPremiumPlan } from 'src/app/models/premium-plan.model';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})


export class PaymentComponent implements OnInit {

  showSearch: boolean = true;


  $premium: Observable<IPremiumPlan> = new Observable<IPremiumPlan>();
  constructor(
    private http: HttpClient,
    private paymentService: PaymentService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.$premium = this.paymentService.getPremium();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn != null ? true : false;
  }

  goToBillingPortal() {
    this.paymentService.redirectToCustomerPortal();
  }
}

