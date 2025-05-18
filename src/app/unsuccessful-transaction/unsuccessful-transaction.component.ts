import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-unsuccessful-transaction',
  imports: [RouterLink],
  templateUrl: './unsuccessful-transaction.component.html',
  styleUrl: './unsuccessful-transaction.component.css'
})
export class UnsuccessfulTransactionComponent {
  error: string = '';

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      this.error = params['error'];
    });
  }
}
