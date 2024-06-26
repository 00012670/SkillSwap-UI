import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICustomerPortal, IPremiumPlan, ISession } from '../models/premium-plan.model';
import { Observable, of } from 'rxjs';


declare const Stripe: any;
@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  getPremium(): Observable<IPremiumPlan> {
    return of({
      id: 'prod_PuFBZSQxL3ng0v',
      priceId: 'price_1P4QguP2zd9Sg1qKXiyDONDG',
      name: 'Exclusive Premium Plan',
      price: '$9.00',
      features: [
        'Access to unlimited skill listings',
        'Opportunity to offer paid lessons',
        'Ability to track user interactions',
        'Priority visibility in search results',
      ],
    });
  }

  createCheckoutSession(lookupKey: string) {
    return this.http.post(`${this.baseApiUrl}/Payment/create-checkout-session`, {
      lookup_key: lookupKey
    }).toPromise();
  }

  requestMemberSession(priceId: string): void {
    this.http
      .post<ISession>(this.baseApiUrl + '/Payment/create-checkout-session', {
        priceId: priceId,
        successUrl: environment.successUrl,
        failureUrl: environment.failureUrl,
      })
      .subscribe((session) => {
        this.redirectToCheckout(session.sessionId);
      });
  }

  redirectToCheckout(sessionId: string) {
    const stripe = Stripe("pk_test_51OuxWhP2zd9Sg1qKbHEvtUxTLXJsV1EyBbqtYJoTMuIEQB4ov0FkAEAxeguFUmQ6aVz9NrLUnvmHocWObybDWpkH00QYgm84JH");

    stripe.redirectToCheckout({
      sessionId: sessionId,
    });
  }

  redirectToCustomerPortal() {
    this.http
      .post<ICustomerPortal>(
        this.baseApiUrl + '/Payment/customer-portal',
        { returnUrl: environment.homeUrl },
        this.getHttpOptions()
      )
      .subscribe((data) => {
        window.location.href = data.url;
      });
  }

  getHttpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };

    return httpOptions;
  }
}
