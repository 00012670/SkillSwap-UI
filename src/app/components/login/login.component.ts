import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';
import ValidateForm from 'src/app/helpers/validateForm';
import { ResetPasswordService } from 'src/app/services/reset-password..service';
import { CredentialResponse } from 'google-one-tap';
import { ProfileService } from 'src/app/services/profile.service';
import { ImageService } from 'src/app/services/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  resetPasswordEmail!: string;
  isValidEmail!: boolean;
  role!: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetPasswordService: ResetPasswordService,
    private ngZone: NgZone,

  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: "970675568173-36ico2ahva4pirl8ge7gpoqp3dv6p130.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", text: "continue_with", locale: "en" }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => { });
    }
  }


  handleCredentialResponse(response: CredentialResponse): void {
    this.auth.LoginWithGoogle(response.credential).subscribe(
      (x: any) => {
        localStorage.setItem("token", x.token);
        const decodedToken = this.auth.decodedToken();
        const userId = decodedToken.userId;
        setTimeout(() => {
          this.ngZone.run(() => this.router.navigate(['dashboard/', userId]));
        }, 4000);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }



  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setUsernameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({ detail: "SUCCESS", summary: "Login successfuly", duration: 3000 });
            this.router.navigate(['dashboard/', res.userId])
          },
          error: (err) => {
            //console.error('Error during sign-in:', err);
            this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
          },
        });
    } else {
      ValidateForm.validateAllFormFileds(this.loginForm);
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
    }
  }

  checkValidEmail(value: string) {
    this.resetPasswordEmail = value;
    const pattern = /^[\w\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);
      this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.resetPasswordEmail = '';
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
          },
          error: (err) => {
            this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
          }, // Add a comma here
        });
    }
  }
};



