import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  stripePromise: Promise<Stripe | null>;
  elementsPromise: Promise<StripeElements | null>;
  card: StripeCardElement | undefined;
  priceLookupKey: any;

  constructor(
    private http: HttpClient
  ) {
    this.stripePromise = loadStripe('pk_test_51OuxWhP2zd9Sg1qKbHEvtUxTLXJsV1EyBbqtYJoTMuIEQB4ov0FkAEAxeguFUmQ6aVz9NrLUnvmHocWObybDWpkH00QYgm84JH');
    this.elementsPromise = this.stripePromise.then(stripe => stripe ? stripe.elements() : null);
  }

  async createCheckoutSession() {
    const session: any = await this.http.post('/create-checkout-session', {
      lookup_key: this.priceLookupKey
    }).toPromise();

    const stripe = await this.stripePromise;
    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: session?.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    }
  }


  ngOnInit() {
    this.elementsPromise.then(elements => {
      if (elements) {
        this.card = elements.create('card');
        this.card.mount('#card-element');
      }
    });
  }

  async handleForm(e: Event) {
    e.preventDefault();

    const stripe = await this.stripePromise;
    const paymentIntentClientSecret = 'your_payment_intent_client_secret_here'; // You should get this from your backend

    if (stripe && this.card) {
      const result = await stripe.confirmCardPayment(paymentIntentClientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Jenny Rosen'
          }
        }
      });

      if (result.error) {
        // Show error to your customer
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded');
        }
      }
    }
  }

  async onSubmit() {
    // Handle form submission
  }
}
