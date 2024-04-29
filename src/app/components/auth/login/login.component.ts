import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';
import ValidateForm from 'src/app/helpers/validateForm';
import { CredentialResponse } from 'google-one-tap';

// Google client ID constant
const GOOGLE_CLIENT_ID = "970675568173-36ico2ahva4pirl8ge7gpoqp3dv6p130.apps.googleusercontent.com";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  // Declare variables
  loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  resetPasswordEmail!: string;
  isValidEmail!: boolean;

  // Constructor with dependency injection
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    // Validate form fields
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Initialize Google One Tap
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
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

  // Handle Google One Tap response
  handleCredentialResponse(response: CredentialResponse): void {
    // Login with Google
    this.auth.LoginWithGoogle(response.credential).subscribe(
      (x: any) => {
        // Store token and navigate to dashboard
        localStorage.setItem("token", x.token);
        const decodedToken = this.auth.decodedToken();
        const userId = decodedToken.userId;
        this.router.navigate(['dashboard/', userId]).then(() => {
          window.location.reload();
        });
      },
      (error: any) => {
        // Handle error
        this.toast.error({ detail: "ERROR", summary: error.error.message, duration: 5000 });
      }
    );
  }

  // Handle form submission
  onSubmit() {
    // Check if form is valid
    if (this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value)
        .subscribe({
          next: (res) => {
            // Handle successful sign in
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setUsernameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({ detail: "SUCCESS", summary: "Login successfuly", duration: 3000 });
            this.router.navigate(['dashboard/', res.userId]).then(() => {
              window.location.reload();
            });
          },
          error: (err) => {
            // Handle sign in error
            this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
          },
        });
    } else {
      // Handle invalid form
      ValidateForm.validateAllFormFileds(this.loginForm);
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
    }
  }

  // Check if email is valid
  checkValidEmail(value: string) {
    this.resetPasswordEmail = value;
    const pattern = /^[\w\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  // Toggle password visibility
  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'fa-eye' : 'fa-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }
};
