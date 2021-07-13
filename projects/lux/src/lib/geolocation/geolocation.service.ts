import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSource, DataSourceItem } from '../datasource';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface SearchResult {
  place_id: number;
  lat: number;
  lon: number;
  display_name: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private static cacheSize = 10;
  private lastQueriesWithResults = new Map<string, SearchResult[]>();
  private lastQueries: string[] = [];

  constructor(private http: HttpClient) {}

  searchGeolocation(query: string): Observable<SearchResult[]> {
    if (this.lastQueriesWithResults.has(query)) {
      this.lastQueries.splice(this.lastQueries.indexOf(query), 1);
      this.lastQueries.push(query);
      return of(this.lastQueriesWithResults.get(query));
    }
    // Nominatim search documentation:
    // https://nominatim.org/release-docs/develop/api/Search/
    const url =
      'https://nominatim.openstreetmap.org/search?format=json&q=' +
      encodeURIComponent(query);
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.get(url, { headers }).pipe(
      map((response) => {
        const searchResults = response as unknown as SearchResult[];
        if (this.lastQueries.length >= GeolocationService.cacheSize) {
          const deletedQuery = this.lastQueries[0];
          this.lastQueries.splice(0, 1);
          this.lastQueriesWithResults.delete(deletedQuery);
        }
        this.lastQueries.push(query);
        this.lastQueriesWithResults.set(query, searchResults);
        return searchResults;
      })
    );
  }

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
