import { Injectable } from '@angular/core';
import { from, Observable, of, shareReplay } from 'rxjs';

let loading$: Observable<boolean> | null = null;

@Injectable({ providedIn: 'root' })
export class OpenLayerLoaderService {
  load(): Observable<boolean> {
    if ((window as any).ol) {
      return of(true);
    }

    if (!loading$) {
      const openLayerJsUrl = 'https://openlayers.org/en/v5.3.0/build/ol.js';
      const openLayerCssUrl = 'https://openlayers.org/en/v5.3.0/css/ol.css';
      loadCss(openLayerCssUrl, () => {});
      loading$ = from(
        new Promise<boolean>((resolve, _) => {
          loadScript(openLayerJsUrl, () => resolve(true));
        })
      ).pipe(shareReplay(1));
    }
    return loading$;
  }
}

/** Dynamically load a script from url and return a callback */
const loadScript = (url: string, callback: () => void): void => {
  const script: any = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    // for old IE
    script.onreadystatechange = (): void => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    // Others browsers
    script.onload = (): void => {
      callback();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

/** Dynamically load css from url and return a callback */
const loadCss = (url: string, callback: () => void): void => {
  const link: any = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.type = 'text/javascript';
  link.href = url;
  link.onload = (): void => {
    callback();
  };
  document.getElementsByTagName('head')[0].appendChild(link);
};
