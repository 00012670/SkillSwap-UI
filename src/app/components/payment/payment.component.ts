import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { IPremiumPlan } from 'src/app/models/premium-plan.model';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

  $premium: Observable<IPremiumPlan> = new Observable<IPremiumPlan>();
  constructor(
    private http: HttpClient,
    private paymentService: PaymentService
  ) { }


  ngOnInit(): void {
    this.$premium = this.paymentService.getPremium();
  }
}

