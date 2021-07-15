import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSource } from '../datasource';
import { Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs/operators';

interface SearchResult {
  place_id: number;
  lat: number;
  lon: number;
  display_name: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private debouncePeriodMs = 300; // ms
  private cacheSize = 10;
  private lastQueriesWithResults = new Map<string, SearchResult[]>();
  private lastQueries: string[] = [];
  private currentSearch$: Subject<string>;
  private currentQuery$: Observable<SearchResult[]>;

  constructor(private http: HttpClient) {
    this.currentSearch$ = new Subject<string>();

    const typed$ = this.currentSearch$
      .asObservable()
      .pipe(distinctUntilChanged());

    this.currentQuery$ = typed$.pipe(
      debounceTime(this.debouncePeriodMs),

      switchMap((currentQuery) => {
        const data = this.getFromCache(currentQuery);
        if (data !== undefined) {
          return of(data);
        }
        // Nominatim search documentation:
        // https://nominatim.org/release-docs/develop/api/Search/
        const url =
          'https://nominatim.openstreetmap.org/search?format=json&q=' +
          encodeURIComponent(currentQuery);
        const headers = {
          'Content-Type': 'application/json'
        };
        console.log('Before call: ', currentQuery);

        this.addToCache(currentQuery, []);

        return this.http.get(url, { headers }).pipe(
          map((response) => {
            const searchResults = response as unknown as SearchResult[];
            this.addToCache(currentQuery, searchResults);
            return searchResults;
          })
        );
      })
    );
  }

  searchGeolocation(query: string): Observable<SearchResult[]> {
    console.log('SearchLocation: ', query);

    this.currentSearch$.next(query);
    return this.currentQuery$;
  }

  // Cache implemementation ---
  getFromCache(query: string): SearchResult[] {
    if (this.lastQueriesWithResults.has(query)) {
      return this.lastQueriesWithResults.get(query);
    }
    return undefined;
  }
  addToCache(query: string, data: SearchResult[]): SearchResult[] {
    if (this.lastQueriesWithResults.keys.length >= this.cacheSize) {
      const deletedQuery = this.lastQueriesWithResults.keys[0];
      this.revomeFromCache(deletedQuery);
    }
    this.lastQueriesWithResults.set(query, data);
    return data;
  }
  revomeFromCache(query: string): void {
    this.lastQueriesWithResults.delete(query);
  }
  // End cache implemementation ---

  getLabels(
    instance: GeolocationService,
    keys: number[][]
  ): Observable<DataSource<number[], string>> {
    const searchResults = instance.lastQueriesWithResults
      .get(instance.lastQueries[instance.lastQueries.length - 1])
      .filter((searchResult) => samePosition(searchResult, keys));
    return of(
      searchResults.map((searchResult) => {
        const key = [searchResult.lon, searchResult.lat];
        return {
          key,
          label: searchResult.display_name
        };
      })
    );
  }

  getData(
    instance: GeolocationService,
    search: string
  ): Observable<DataSource<number[], string>> {
    return instance.searchGeolocation(search).pipe(
      map((searchResults) =>
        searchResults.map((searchResult) => {
          const key = [searchResult.lon, searchResult.lat];
          const label = searchResult.display_name;
          return { key, label };
        })
      )
    );
  }
}

const samePosition = (
  searchResult: SearchResult,
  keys: number[][]
): boolean => {
  const found = keys.find(
    (item) => searchResult.lon === item[0] && searchResult.lat === item[1]
  );
  return !!found;
};
