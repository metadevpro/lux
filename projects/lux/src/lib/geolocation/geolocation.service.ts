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
  private lastQuery: string;
  private lastSearchResults: SearchResult[] = [];

  constructor(private http: HttpClient) {}

  searchAddress(query: string): Observable<SearchResult[]> {
    if (this.lastQuery === query) {
      return of(this.lastSearchResults);
    }
    this.lastQuery = query;
    const url =
      'https://nominatim.openstreetmap.org/search?format=json&q=' +
      encodeURIComponent(query);
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.http.get(url, { headers }).pipe(
      map((response) => {
        this.lastSearchResults = response as unknown as SearchResult[];
        return this.lastSearchResults;
      })
    );
  }

  getLabels(
    instance: GeolocationService,
    keys: number[][]
  ): Observable<DataSource<number[], string>> {
    const searchResults = instance.lastSearchResults.filter((searchResult) =>
      samePosition(searchResult, keys)
    );
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
    return instance.searchAddress(search).pipe(
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
