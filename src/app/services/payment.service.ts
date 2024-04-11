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
      id: '',
      priceId: 'Please add your price id',
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
    return this.http.post(`${this.baseApiUrl}api/Payment/create-checkout-session`, {
      lookup_key: lookupKey
    }).toPromise();
  }

  // requestMemberSession(priceId: string): void {
  //   this.http
  //     .post<ISession>(this.baseApiUrl + 'api/Payment/create-checkout-session', {
  //       priceId: priceId,
  //       successUrl: environment.successUrl,
  //       failureUrl: environment.cancelUrl,
  //     })
  //     .subscribe((session) => {
  //       this.redirectToCheckout(session);
  //     });
  // }

  redirectToCheckout(session: ISession) {
    const stripe = Stripe(session.publicKey);

    stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });
  }


  // Stripe Test Publishable Key
  // pk_test_51OuxWhP2zd9Sg1qKbHEvtUxTLXJsV1EyBbqtYJoTMuIEQB4ov0FkAEAxeguFUmQ6aVz9NrLUnvmHocWObybDWpkH00QYgm84JH


  // redirectToCustomerPortal() {
  //   this.http
  //     .post<ICustomerPortal>(
  //       this.baseApiUrl + 'api/Payment/customer-portal',
  //       { returnUrl: environment.homeUrl },
  //       this.getHttpOptions()
  //     )
  //     .subscribe((data) => {
  //       window.location.href = data.url;
  //     });
  // }

  // getHttpOptions() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + localStorage.getItem('token'),
  //     }),
  //   };

  //   return httpOptions;
  // }
}
