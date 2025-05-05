import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../data-service/data.service';

@Component({
  standalone: true,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userName: string = '';

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.dataService.getCustomerData().subscribe(
      (response: any) => {
        this.userName = response.legalName;
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }

  logout(): void {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
