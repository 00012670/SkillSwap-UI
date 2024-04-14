import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        'Enhanced visibility with priority in search results',
      ],
    });
  }

  createCheckoutSession(lookupKey: string) {
    return this.http.post(`${this.baseApiUrl}/Payment/create-checkout-session`, {
      lookup_key: lookupKey
    }).toPromise();
  }

  requestPremiumSession(priceId: string): void {
    this.http
      .post<ISession>(this.baseApiUrl + '/Payment/create-checkout-session', {
        priceId: priceId,
        successUrl: environment.successUrl,
        failureUrl: environment.failureUrl,
      })
      .subscribe(
        (session) => {
          console.log("ckeckout session", session);
          this.redirectToCheckout(session);
        },
        (error) => {
          console.error('Failed to create checkout session:', error);
        }
      );
  }


  redirectToCheckout(session: ISession) {
    const stripe = Stripe(session.publicKey);

    stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });
  }
}
