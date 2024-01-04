import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helper/validateForm';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private fb: FormBuilder, private auth : AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSignup() {
    if (this.signUpForm.valid) {
      //send object to database
      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next:(res=>{
          alert(res.message)
          this.signUpForm.reset();
          this.router.navigate(['login']);
        })
        ,error:(err=>{
          alert(err?.error.message)
        })
    })

    console.log(this.signUpForm.value);
    }else {
      ValidateForm.validateAllFormFileds(this.signUpForm)
      //alert("Your form is invalid");
    }
  }
}
