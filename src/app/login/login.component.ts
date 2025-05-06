import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { AuthService } from '../auth-service/auth.service';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: `./login.component.html`,
    styles: []
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);
      this.dataService.login(authHeader).subscribe(
        (response) => {
          this.authService.setToken(authHeader);
          console.log('Login successful', response);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
