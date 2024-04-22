import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SkillsListComponent } from './components/skills/list-skills/skills-list.component';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { EditSkillComponent } from './components/skills/edit-skill/edit-skill.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SwapRequestComponent } from './components/swap-request/swap-request.component';
import { ManageRequestsComponent } from './components/swap-request/manage-requests/manage-requests.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ChatComponent } from './components/chat/chat.component';
import { PaymentCheckoutComponent } from './components/payment/payment-checkout/payment-checkout.component';
import { PaymentFailureComponent } from './components/payment/payment-failure/payment-failure.component';
import { PaymentSuccessComponent } from './components/payment/payment-success/payment-success.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'skills/create', component: AddSkillComponent, canActivate: [AuthGuard] },
  { path: 'skills/:userId', component: SkillsListComponent, canActivate: [AuthGuard] },
  { path: 'skills', component: SkillsListComponent, canActivate: [AuthGuard] },
  { path: 'skill/:id', component: EditSkillComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'swap/:id', component: SwapRequestComponent, canActivate: [AuthGuard] },
  { path: 'manage-requests/:id', component: ManageRequestsComponent, canActivate: [AuthGuard] },
  { path: 'payment/:id', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: PaymentCheckoutComponent },
  { path: 'failure', component: PaymentFailureComponent },
  { path: 'success', component: PaymentSuccessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
