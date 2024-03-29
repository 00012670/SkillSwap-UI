import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService

  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSignup() {
    if (this.signUpForm.valid) {
      this.auth.signUp(this.signUpForm.value)
        .subscribe({
          next: (res => {
            this.auth.storeToken(res.token);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setUsernameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
            this.router.navigate(['dashboard/', res.userId])
          }),
          error: (err => {
           // console.error('Error during sign-in:', err);
            this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
          })
        });
    } else {
      ValidateForm.validateAllFormFileds(this.signUpForm)
      this.toast.error({ detail: "ERROR", summary: "Your form is invalid", duration: 5000 });
      //alert("Your form is invalid");
    }
  }
}




