import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';
import { CredentialResponse } from 'google-one-tap';

// Google client ID constant
const GOOGLE_CLIENT_ID = "970675568173-36ico2ahva4pirl8ge7gpoqp3dv6p130.apps.googleusercontent.com";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {

  // Declare variables
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signUpForm!: FormGroup;

  // Constructor with dependency injection
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
  ) { }

  ngOnInit(): void {
    // Validate form fields
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
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

  // Function to handle sign-up
  onSignup() {
    // Check if form is valid
    if (this.signUpForm.valid) {
      this.auth.signUp(this.signUpForm.value)
        .subscribe({
          next: (res => {
            // Handle successful sign up
            this.auth.storeToken(res.token);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setUsernameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({ detail: "Success", summary: res.message, duration: 5000 });
            this.router.navigate(['dashboard/', res.userId]).then(() => {
              window.location.reload();
            });
          }),
          error: (err => {
            this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
          })
        });
    } else {
      ValidateForm.validateAllFormFileds(this.signUpForm)
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
    }
  }

  // Toggle password visibility
  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'fa-eye' : 'fa-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }
}




