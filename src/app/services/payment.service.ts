import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  createCheckoutSession(lookupKey: string) {
    return this.http.post(`${this.baseApiUrl}api/Payment/create-checkout-session`, {
      lookup_key: lookupKey
    }).toPromise();
  }
}
