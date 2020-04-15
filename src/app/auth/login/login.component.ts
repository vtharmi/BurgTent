import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubcription: Subscription;
  emailMessage: string = '';
  email: string = '';
  password: string = '';
  loginForm: FormGroup;

  private validationMessageForEmail = {
    required: 'Please enter an email address.',
    email: 'Please enter a valid email address.'
  }

  constructor(private _fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {

    this.loginForm = this._fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });

    const emailController = this.loginForm.get('email');
    emailController.valueChanges.pipe(
      debounceTime(2000)
    ).subscribe(
      value => {
        this.setMessage(emailController);
      })

      this.authStatusSubcription =  this.authService.getAuthStatusListener().subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );

  }

  submit() {
    this.isLoading = true;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
  }
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessageForEmail[key]
      ).join(' ');
    }
  }

  ngOnDestroy() {
    this.authStatusSubcription.unsubscribe();
  }
}


