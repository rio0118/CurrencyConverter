import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CurrencyConverterInput } from '../models/currency-converter-input.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {
  baseValetApiUrl: string = "https://www.bankofcanada.ca/valet";
  filter: string = "";

  constructor(private http: HttpClient) { }

  getExchangeAmount(currencyInput: CurrencyConverterInput): Observable<any> {
    this.filter = "/observations/FX" + currencyInput.fromCurrency + currencyInput.toCurrency + "?start_date=" + currencyInput.conversionDate + "&end_date=" + currencyInput.conversionDate;
    return this.http.get<any>(this.baseValetApiUrl + this.filter);
  }

  // Need to get data from the server later
  getSupportedCurrencies(): Observable<string[]> {
    const tempSupportedCurrencies: string[] = ['CAD', 'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CHF', 'CNY', 'HKD', 'MXN', 'INR'];
    return of(tempSupportedCurrencies);
  }

}
