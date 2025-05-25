import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data-service/data.service';
import { CurrencyPipe, NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-footprint',
  templateUrl: './footprint.component.html',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    NgClass
  ],
  styleUrls: ['./footprint.component.css']
})
export class FootprintComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  iban: string = '';
  periodBin: string = '';
  categoryData: { [period: string]: { [category: string]: { transactions: any[], amountSum: number, emissionSum: number } } } = {};
  selectedPeriod: string | null = null;

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
      this.iban = params['iban'];
      this.periodBin = params['periodBin'];
      this.fetchCategoryData();
    });
  }

  fetchCategoryData(): void {
    this.dataService.getTransactionPerCategory(this.iban, this.startDate, this.endDate, this.periodBin).subscribe(
      (response: { [period: string]: { [category: string]: any[] } }) => {
        for (const period in response) {
          this.categoryData[period] = {};
          for (const category in response[period]) {
            const transactions = response[period][category];
            const amountSum = transactions.reduce((sum, t) => sum + t.amount, 0);
            const emissionSum = transactions.reduce((sum, t) => sum + t.emission, 0);
            this.categoryData[period][category] = { transactions, amountSum, emissionSum };
          }
        }
        // Automatically select the first period
        this.selectedPeriod = Object.keys(this.categoryData)[0];
      },
      (error) => {
        console.error('Error fetching category data:', error);
      }
    );
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
  }

  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      Electricity: 'bi bi-lightning',
      Gas: 'bi bi-fire',
      Fuel: 'bi bi-fuel-pump',
      Train: 'bi bi-train-front',
      Bus: 'bi bi-bus-front',
      Taxi: 'bi bi-taxi-front',
      Clothes: 'bi bi-bag',
      Groceries: 'bi bi-basket',
      Meats: 'bi bi-piggy-bank',
      Vegetables: 'bi bi-leaf',
      Fruits: 'bi bi-apple',
      Dairy: 'bi bi-cup-straw',
      Alcohol: 'bi bi-cup',
      'Soft Drinks': 'bi bi-cup-soda',
      'Paper products': 'bi bi-file-earmark-text',
      'Plastic products': 'bi bi-box',
      Electronics: 'bi bi-phone',
      'Motor vehicles': 'bi bi-car-front',
      Furniture: 'bi bi-house',
      Banking: 'bi bi-bank',
      Insurance: 'bi bi-shield-check',
      Education: 'bi bi-book',
      'Recreational Services': 'bi bi-controller',
      Other: 'bi bi-question-circle'
    };
    if (!category || !categoryIcons[category]) {
      return categoryIcons['Other'];
    }
    return categoryIcons[category];
  }

  getTotalValuesForPeriod(period: string): { totalAmount: number; totalEmission: number } {
    let totalAmount = 0;
    let totalEmission = 0;

    for (const category of Object.keys(this.categoryData[period])) {
      totalAmount += this.categoryData[period][category].amountSum;
      totalEmission += this.categoryData[period][category].emissionSum;
    }

    return { totalAmount, totalEmission };
  }

  navigateToTransactions(category: string): void {
    const transactions = this.categoryData[this.selectedPeriod!][category].transactions;
    this.router.navigate(['/footprint-transactions'], {
      queryParams: {
        transactions: JSON.stringify(transactions),
        period: this.selectedPeriod,
        category: category,
        iban: this.iban
      }
    });
  }

  protected readonly Object = Object;
}
