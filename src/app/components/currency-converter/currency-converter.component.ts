import { Component, OnInit } from '@angular/core';
import { CurrencyConverterInput } from 'src/app/models/currency-converter-input.model';
import { CurrencyConverterOutput } from 'src/app/models/currency-converter-output.model';
import { CurrencyConverterService } from 'src/app/services/currency-converter.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  today: string = new Date().toLocaleDateString('en-CA');
  isDisableFrom: boolean = true;
  isDisableTo: boolean = false;
  errorMessage: string = "";

  // Define a input for getting proper exchange rate
  currencyInput: CurrencyConverterInput = {
    amount: 0,
    seriesNames: '',
    fromCurrency: 'CAD',
    toCurrency: 'USD',
    conversionDate: this.today
  };
  currencyOutput: CurrencyConverterOutput = {
    amount: 0,
    exchangeRate: 0
  };

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

  // get converted currency - verify input, call api, set result
  convertCurrency() {
    if(this.verifyCurrencyInput()) {

      // set a key for valet api
      this.currencyInput.seriesNames = "FX" + this.currencyInput.fromCurrency + this.currencyInput.toCurrency;
      
      if(this.currencyInput.seriesNames == "FXCADCAD") {       // handle exceptional case
        // to make the same value not using 4 decimal places
        this.currencyOutput.exchangeRate = 1;
        this.currencyOutput.amount = this.currencyInput.amount;  
      } else { // handle common case
        this.currencyConverterService.getExchangeAmount(this.currencyInput)
        .subscribe({
          next: (exchangeInfo) => {
            console.log(exchangeInfo);
  
            if(exchangeInfo.observations.length > 0) {
              this.currencyOutput.exchangeRate = exchangeInfo.observations[0][this.currencyInput.seriesNames].v;
              this.currencyOutput.amount = Number((this.currencyInput.amount * this.currencyOutput.exchangeRate).toFixed(4));  
            } else {
              this.printExchangeRateNotExist();
            }
           },
          error: (response) => {
            console.log(response);
  
          }
        });
      }
    }
  }

  switchCurrency() {
    // set disabled
    this.isDisableFrom = !this.isDisableFrom;
    this.isDisableTo = !this.isDisableTo;

    // swap data
    const tempCurrency: string = this.currencyInput.fromCurrency;
    this.currencyInput.fromCurrency = this.currencyInput.toCurrency;
    this.currencyInput.toCurrency = tempCurrency;

    const tempAmount: number = this.currencyInput.amount;
    this.currencyInput.amount = this.currencyOutput.amount;
    this.currencyOutput.amount = tempAmount;
  }

  verifyCurrencyInput() {
    this.errorMessage = "";
    if (this.currencyInput.amount < 0) {
      this.printCurrencyNegativeInput();
      return false;
    }

    return true;
  }

  onChangeFromCurrency(event: Event) {
    this.initialieOutputValues();
  }

  onChangeToCurrency(event: Event) {
    this.initialieOutputValues();
  }

  onChangeConversionDate(event: Event) {
    this.initialieOutputValues();
  }

  onKeyUpFromAmount(event: Event) {
    this.initialieOutputValues();
  }

  initialieOutputValues() {
    this.currencyOutput.amount = 0;
    this.currencyOutput.exchangeRate = 0;
  }

  printExchangeRateNotExist() {
    // need to use environment value later
    this.errorMessage = "Exchange Rate for selected date not exist. Choose another date.";
  }

  printCurrencyNegativeInput() {
    // need to use environment value later
    this.errorMessage = "Amount should be a positive number";
  }

}


