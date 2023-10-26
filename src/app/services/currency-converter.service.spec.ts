import { TestBed } from '@angular/core/testing';

import { CurrencyConverterService } from './currency-converter.service';
import { CurrencyConverterInput } from '../models/currency-converter-input.model';
import { HttpClientModule } from '@angular/common/http';

describe('CurrencyConverterService', () => {
  let service: CurrencyConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(CurrencyConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('should be correct the converted amount', (done: DoneFn) => {
    const currencyInput: CurrencyConverterInput = {
      amount: 1,
      seriesNames: 'FXCADUSD',
      fromCurrency: 'CAD',
      toCurrency: 'USD',
      conversionDate: '2023-10-25'
    };

    const temp: any = service.getExchangeAmount(currencyInput);

    temp.subscribe((result: any) => {
      const exchangeRate = result.observations[0][currencyInput.seriesNames].v;
      const amount = Number((currencyInput.amount *exchangeRate).toFixed(4));

      expect(0.7256).toBe(amount);
      done()
    });
        
  })
});
