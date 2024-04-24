import { SignupComponent } from './components/auth/signup/signup.component';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { SkillsListComponent } from './components/skills/list-skills/skills-list.component';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { EditSkillComponent } from './components/skills/edit-skill/edit-skill.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from './components/filter.pipe';
import { SwapRequestComponent } from './components/swap-request/swap-request.component';
import { CommonModule } from '@angular/common';
import { ModalContent } from './components/swap-request/swap-modal/swap-modal.component';
import { ManageRequestsComponent } from './components/swap-request/manage-requests/manage-requests.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ChatComponent } from './components/chat/chat.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatCardModule } from '@angular/material/card';
import { PaymentFailureComponent } from './components/payment/payment-failure/payment-failure.component';
import { PaymentSuccessComponent } from './components/payment/payment-success/payment-success.component';
import { NavbarComponent } from './components/navigation/navbar/navbar.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { ReviewComponent } from './components/swap-request/review/review.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NotificationModalComponent } from './components/notification/notification.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    SkillsListComponent,
    AddSkillComponent,
    EditSkillComponent,
    ProfileComponent,
    FilterPipe,
    SwapRequestComponent,
    ModalContent,
    ManageRequestsComponent,
    PaymentComponent,
    ChatComponent,
    PaymentFailureComponent,
    PaymentSuccessComponent,
    NavbarComponent,
    SidebarComponent,
    ReviewComponent,
    CalendarComponent,
    NotificationModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgToastModule,
    NgbModule,
    NgbModalModule,
    MatCardModule,
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    PickerModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],

  bootstrap: [AppComponent]
})
export class AppModule { }
