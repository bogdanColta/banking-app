import {Component, OnInit} from '@angular/core';
import {FormsModule,} from '@angular/forms';
import {Chart, ChartDataset, ChartOptions, ChartType, registerables} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {DataService} from '../data-service/data.service';
import {CurrencyPipe, NgForOf, CommonModule} from '@angular/common';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-insights',
  imports: [
    FormsModule,
    BaseChartDirective,
    NgForOf,
    CurrencyPipe,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  formData = {
    iban: '',
    startDate: '',
    endDate: '',
    periodBin: 'month'
  };

  constructor(private dataService: DataService, private datePipe: DatePipe, private router: Router) {
  }

  ibans: string[] = [];
  inAmount: number = 0;
  outAmount: number = 0;
  totalAmount: number = 0;

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        ticks: {
          maxTicksLimit: 5,
          // source: 'data',
        },
        grid: {
          display: false,
        },
        border: {
          width: 6
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 2,
        },
        grid: {
          display: false
        },
        border: {
          width: 6
        }
      }
    }
  };

  public lineChartData: ChartDataset<'line'>[] = [];
  public lineChartLabels: string[] = [];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  ngOnInit() {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.formData.startDate = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd') || '';
    this.formData.endDate = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd') || '';

    this.dataService.getBankAccounts().subscribe(
      (response) => {
        this.ibans = response.map((account: any) => account.iban);
        console.log('IBANs fetched successfully', this.ibans);
        if (this.ibans.length > 0) {
          this.formData.iban = this.ibans[0];
        }
        this.onFormChange();
      },
      (error) => {
        console.error('Error fetching IBANs', error);
      }
    );
  }

  onFormChange() {
    const {iban, startDate, endDate, periodBin} = this.formData;
    if (iban && startDate && endDate && periodBin) {
      const orange = getComputedStyle(document.documentElement).getPropertyValue('--primary-orange').trim();
      const hoverColor = '#fff'; // or any contrasting color for hover
      this.dataService.getInsightsForAmountSpent(iban, startDate, endDate, periodBin).subscribe(
        (response) => {
          this.lineChartData = [
            {
              data: Object.values(response),
              borderColor: orange,
              backgroundColor: orange,
              pointBackgroundColor: orange,
              pointBorderColor: orange,
              pointHoverBackgroundColor: hoverColor,
              pointHoverBorderColor: orange,
              borderWidth: 3,
              pointRadius: 10,
              pointHoverRadius: 15,
            }
          ];
          this.lineChartLabels = Object.keys(response);
        },
        (error) => {
          console.error('Error fetching insights', error);
        }
      );
      this.dataService.getInsightsInAndOutAmounts(iban, startDate, endDate).subscribe(
        (response: { inAmount: number; outAmount: number }) => {
          this.inAmount = response.inAmount;
          this.outAmount = response.outAmount;
          this.totalAmount = this.inAmount + this.outAmount;
        },
        (error) => {
          console.error('Error fetching amounts', error);
        }
      );
      this.fetchCategories();
    }
  }

  getInAmountPercentage(): number {
    return this.totalAmount ? (this.inAmount / this.totalAmount) * 100 : 0;
  }

  getOutAmountPercentage(): number {
    return this.totalAmount ? (this.outAmount / this.totalAmount) * 100 : 0;
  }

  redirectToFootprint(): void {
    this.router.navigate(['/footprint'], {
      queryParams: {
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        iban: this.formData.iban,
        periodBin: this.formData.periodBin
      }
    });
  }

  redirectToIncomeTransactions(type: 'in' | 'out'): void {
    this.router.navigate(['/income-transactions'], {
      queryParams: {
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        iban: this.formData.iban,
        periodBin: this.formData.periodBin,
        type: type
      }
    });
  }

  fetchCategories() {
    const { iban, startDate, endDate } = this.formData;
    if (iban && startDate && endDate) {
      this.dataService.getTransactionPerCategoryWithNoPeriod(iban, startDate, endDate).subscribe(
        (response) => {
          // Type assertion to fix the TS error
          this.categories = Object.entries(response as { [category: string]: any[] }).map(
            ([category, transactions]) => ({
              name: category,
              amount: (transactions as any[]).reduce((sum, t) => sum + t.amount, 0),
              transactions: transactions as any[]
            })
          ).sort((a, b) => b.amount - a.amount);
        },
        (error) => {
          console.error('Error fetching categories', error);
        }
      );
    }
  }

  categories: { name: string, amount: number, transactions: any[] }[] = [];

  viewCategoryTransactions(category: any) {
    this.router.navigate(['/category-transactions'], {
      queryParams: {
        iban: this.formData.iban,
        category: category.name,
        transactions: JSON.stringify(category.transactions)
      }
    });
  }

  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      Electricity: 'bi bi-lightning',
      Gas: 'bi bi-fire',
      Fuel: 'bi bi-fuel-pump',
      Train: 'bi bi-train-front',
      Bus: 'bi bi-bus-front',
      Taxi: 'bi bi-taxi-front',
      Clothes: 'bi bi-shirt',
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
      Other: 'bi bi-person-badge-fill'
    };
    if (!category || !categoryIcons[category]) {
      return categoryIcons['Other'];
    }
    return categoryIcons[category];
  }
}
