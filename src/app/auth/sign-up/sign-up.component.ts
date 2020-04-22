import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

function passwordMatcher(c: AbstractControl) {
  const passwordControl = c.get('password');
  const confirmPasswordControll = c.get('confirmPassword');

  if (passwordControl.pristine || confirmPasswordControll.pristine) {
    return null;
  }

  if (passwordControl.value === confirmPasswordControll.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubcription: Subscription;
  signUpForm: FormGroup;
  emailMessage: string;
  passwordMessage: string;
  invalidSignUp = false;

  private validationMessageForEmail = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  }

  private validationMessageForPassword = {
    required: 'Please enter password',
    minlength: 'Password should be minimum of 8 characters'
  }


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
        { validator: passwordMatcher })
    })

    const emailController = this.signUpForm.get('email');
    emailController.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => {
        this.setMessage(emailController, this.validationMessageForEmail);
      })

    const passwordController = this.signUpForm.get('passwordGroup.password');
    passwordController.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => {
        this.setMessage(passwordController, this.validationMessageForPassword);
      })

      this.authStatusSubcription =  this.authService.getAuthStatusListener().subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );
  }

  setMessage(c: AbstractControl, messageObject): void {
    this.emailMessage = '';
    this.passwordMessage = '';
    if (messageObject === this.validationMessageForEmail) {
      if ((c.touched || c.dirty) && c.errors) {
        this.emailMessage = Object.keys(c.errors).map(
          key => messageObject[key]
        ).join(' ');
      }
    }
    if (messageObject === this.validationMessageForPassword) {
      if ((c.touched || c.dirty) && ! c.valid) {
        this.passwordMessage = Object.keys(c.errors).map(
          key => messageObject[key]
        ).join(' ');
      }
    }
  }

  submit() {
    this.isLoading = true
    const email =  this.signUpForm.value['email'];
    const password =  this.signUpForm.value['passwordGroup'].password;
    
    this.authService.signUp(email, password);
    this.invalidSignUp = !this.authService.getIsAuth();
    if(this.invalidSignUp === true){
      this.signUpForm.reset();
    }
  }

  ngOnDestroy() {
    this.authStatusSubcription.unsubscribe();
  }

}
