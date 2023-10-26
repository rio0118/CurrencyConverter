import { Component, OnInit } from '@angular/core';
import { CurrencyConverterInput } from 'src/app/models/currency-converter-input.model';
import { CurrencyConverterService } from 'src/app/services/currency-converter.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  today: string = new Date().toLocaleDateString('en-CA');

  // Define a input for getting proper exchange rate
  currencyInput: CurrencyConverterInput = {
    amount: 0,
    fromCurrency: 'CAD',
    toCurrency: 'USD',
    conversionDate: this.today
  };
  exchangeAmount: number = 0;

  // Define a list of supported currencies
  supportedCurrencies: string[] = [];

  constructor(private currencyConverterService: CurrencyConverterService){
    // Set default values or initialize the component properties here
  }
  
  ngOnInit(): void {
    // get supported currencies
    this.currencyConverterService.getSupportedCurrencies()
      .subscribe({
        next: (currencyInfo) => {
          this.supportedCurrencies = currencyInfo;
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  convertCurrency() {
    this.currencyConverterService.getExchangeAmount(this.currencyInput)
      .subscribe({
        next: (exchangeInfo) => {
          const code: string = "FX" + this.currencyInput.fromCurrency + this.currencyInput.toCurrency;
          console.log(exchangeInfo.observations[0][code].v);
          const exchangeRate: number = exchangeInfo.observations[0][code].v;
          this.exchangeAmount = this.currencyInput.amount * exchangeRate;
          console.log(this.exchangeAmount);
        },
        error: (response) => {
          console.log(response);
        }
      });

  }

}
