import { SignupComponent } from './components/signup/signup.component';
import { NgModule } from '@angular/core';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { SkillsListComponent } from './components/skills/skills-list/skills-list.component';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { EditSkillComponent } from './components/skills/edit-skill/edit-skill.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from './components/filter.pipe';
import { SwapRequestComponent } from './components/swap-request/swap-request.component';
import { CommonModule } from '@angular/common';
import { ModalContent } from './components/swap-modal/swap-modal.component';

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
    ModalContent
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
    CommonModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
