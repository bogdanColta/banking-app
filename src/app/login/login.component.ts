import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { AuthService } from '../auth-service/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="username">Username:</label>
        <input id="username" formControlName="username" type="text" />
        <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
          <small *ngIf="loginForm.get('username')?.errors?.['required']">Username is required.</small>
        </div>
      </div>

      <div>
        <label for="password">Password:</label>
        <input id="password" formControlName="password" type="password" />
        <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
          <small *ngIf="loginForm.get('password')?.errors?.['required']">Password is required.</small>
        </div>
      </div>

      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  `,
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
