import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { IPremiumPlan } from 'src/app/models/premium-plan.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { ThemeService } from 'src/app/services/theme.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})


export class PaymentComponent implements OnInit {

  showSearch: boolean = false;

  $premium: Observable<IPremiumPlan> = new Observable<IPremiumPlan>();
  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    public themeService: ThemeService
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

  onSubmit(f: NgForm) {
    this.paymentService.requestMemberSession(f.value.priceId);
  }
}

