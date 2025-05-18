import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth-service/auth.service';
import {NgForOf} from '@angular/common';

@Component({
    selector: 'app-help-page',
  imports: [
    NgForOf,
  ],
    templateUrl: 'help-page.component.html',
    styleUrls: ['help-page.component.css']
})
export class HelpPageComponent {
  constructor(private router: Router, private authService: AuthService) {
  }

  logout(): void {
    console.log('User logged out');
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  faqs = [
    { question: 'How do I reset my password?', answer: 'Go to settings and click "Reset Password".' },
    { question: 'How can I contact support?', answer: 'Use the chat or call options below.' },
    { question: 'Where can I download my Annual Financial Summary?', answer: 'You can download it from the Documents section in your account settings.' },
    { question: 'How can I increase my limits?', answer: 'Contact support or visit the Limits section in your profile.' },
    { question: 'How do I set up Apple Pay?', answer: 'Go to your card settings and select "Add to Apple Pay".' },
    { question: 'How can I set up, change or delete standing orders?', answer: 'Manage standing orders from the Payments section in your account.' }
  ];

  helpTopics = [
    { name: 'Account', icon: 'bi bi-person' },
    { name: 'Payments', icon: 'bi bi-credit-card' },
    { name: 'Security', icon: 'bi bi-shield-lock' },
    { name: 'Settings', icon: 'bi bi-gear' },
    // Add more topics as needed
  ];
}
