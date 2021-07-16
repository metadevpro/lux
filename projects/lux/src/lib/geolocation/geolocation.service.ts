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
import { GeoPoint } from '../map/geopoint';

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
  private cacheSize = 20;
  private lastQueriesWithResults = new Map<string, SearchResult[]>();
  private lastQueriesLru: string[] = [];
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
          'https://nominatim.openstreetmap.org/search?format=json&limit=20&q=' +
          encodeURIComponent(currentQuery);
        const headers = {
          'Content-Type': 'application/json'
        };
        this.addToCache(currentQuery, []);

        return this.http.get(url, { headers }).pipe(
          map((response) => {
            const searchResults = response as unknown as SearchResult[];
            const uniqueResults = distinct(searchResults);
            return this.addToCache(currentQuery, uniqueResults);
          })
        );
      })
    );
  }

  searchGeolocation(query: string): Observable<SearchResult[]> {
    this.currentSearch$.next(query);
    return this.currentQuery$;
  }

  getLabels(
    instance: GeolocationService,
    keys: GeoPoint[]
  ): Observable<DataSource<GeoPoint, string>> {
    const searchResults = instance.lastQueriesWithResults
      .get(instance.getLatestQuery())
      .filter((searchResult) => samePosition(searchResult, keys));
    return of(
      searchResults.map((searchResult) => {
        const key: GeoPoint = {
          type: 'Point',
          coordinates: [searchResult.lon, searchResult.lat]
        };
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
  ): Observable<DataSource<GeoPoint, string>> {
    return instance.searchGeolocation(search).pipe(
      map((searchResults) =>
        searchResults.map((searchResult) => {
          const key: GeoPoint = {
            type: 'Point',
            coordinates: [searchResult.lon, searchResult.lat]
          };
          const label = searchResult.display_name;
          return { key, label };
        })
      )
    );
  }

  // Cache implemementation ---
  private getFromCache(query: string): SearchResult[] {
    if (this.lastQueriesWithResults.has(query)) {
      return this.lastQueriesWithResults.get(query);
    }
    return undefined;
  }
  private addToCache(query: string, data: SearchResult[]): SearchResult[] {
    if (this.lastQueriesWithResults.keys.length >= this.cacheSize) {
      const deletedQuery = this.lastQueriesLru[0];
      this.revomeFromCache(deletedQuery);
    }
    this.lastQueriesWithResults.set(query, data);
    this.lastQueriesLru.push(query);
    return data;
  }
  private revomeFromCache(query: string): void {
    this.lastQueriesWithResults.delete(query);
    const index = this.lastQueriesLru.findIndex((it) => it === query);
    this.lastQueriesLru.splice(index, 1);
  }
  private getLatestQuery(): string | null {
    return this.lastQueriesLru.length
      ? this.lastQueriesLru[this.lastQueriesLru.length - 1]
      : null;
  }
  // End cache implemementation ---
}

const samePosition = (
  searchResult: SearchResult,
  keys: GeoPoint[] | GeoPoint
): boolean => {
  if ((keys as GeoPoint).coordinates) {
    return (
      searchResult.lon === (keys as GeoPoint).coordinates[0] &&
      searchResult.lat === (keys as GeoPoint).coordinates[1]
    );
  }
  let found = false;
  (keys as GeoPoint[]).forEach((item) => {
    if (
      searchResult.lon === item.coordinates[0] &&
      searchResult.lat === item.coordinates[1]
    ) {
      found = true;
    }
  });
  return found;
};

const distinct = (data: SearchResult[]): SearchResult[] => {
  const unique: { [key: string]: number } = {};
  return data.filter((r) => {
    if (unique[r.display_name]) {
      return false;
    }
    unique[r.display_name] = 1;
    return true;
  });
};
