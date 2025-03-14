import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic Ym9nZGFuQGdtYWlsLmNvbToxMjM0' // Replace YOUR_TOKEN_HERE with the actual token
  });
  private url = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<any> {
    return this.http.get(this.url + 'transactions', { headers: this.headers });
  }
}
