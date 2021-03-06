import { Component, AfterContentInit } from '@angular/core';
import { DataSourceItem } from 'lux/public-api';
import { DataSource } from 'projects/lux/src/lib/datasource';
import { Observable, of } from 'rxjs';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-autocomplete-list-sample',
  templateUrl: './autocomplete-list-sample.component.html'
})
export class AutoCompleteListSampleComponent implements AfterContentInit {
  disabled1 = false;
  disabled2 = false;

  countries: DataSource<string, string> = [
    { key: 'ES', label: 'Spain' },
    { key: 'SM', label: 'San Marino' },
    { key: 'IT', label: 'Italy' },
    { key: 'UK', label: 'United Kingdom' },
    { key: 'SW', label: 'Sweden' },
    { key: 'SZ', label: 'Switchzerland' },
    { key: 'AU', label: 'Australia' },
    { key: 'AT', label: 'Austria' },
    { key: 'CR', label: 'Costa Rica' },
    { key: 'FR', label: 'France' },
    { key: 'VE', label: 'Venezuela' },
    { key: 'BO', label: 'Bolivia' },
    { key: 'CO', label: 'Colombia' },
    { key: 'JP', label: 'Japan' },
    { key: 'CH', label: 'China' },
    { key: 'MO', label: 'Morroco' },
    { key: 'DZ', label: 'Argelia' },
    { key: 'AR', label: 'Argentina' },
    { key: 'AM', label: 'Armenia' }
  ];
  myPlaces = ['ES', 'IT', 'CR'];
  myPlaces2 = ['AM', 'DZ', 'JP'];

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
  getLabel(isoCode: string): string {
    const found = this.countries.find((c) => c.key === isoCode);
    return found ? found.label : null;
  }

  get self(): AutoCompleteListSampleComponent {
    return this;
  }
  getLabels(instance: any, keys: any[]): Observable<DataSource<any, string>> {
    return of(
      instance.countries.filter((c: DataSourceItem<string, string>) =>
        (keys || []).includes(c.key)
      )
    );
  }
  getData(instance: any, search: string): Observable<DataSource<any, string>> {
    const searchKey = (search || '').toLowerCase();
    return of(
      instance.countries.filter((c: DataSourceItem<string, string>) =>
        c.label.toLowerCase().includes(searchKey)
      )
    );
  }
}
