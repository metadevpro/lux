import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';

let openLayersIsInstalled = false;

@Injectable({ providedIn: 'root' })
export class OpenLayerLoaderService {
  load(): Observable<boolean> {
    if ((window as any).ol) {
      return of(true);
    }

    const openLayerJsUrl = 'https://openlayers.org/en/v5.3.0/build/ol.js';
    const openLayerCssUrl = 'https://openlayers.org/en/v5.3.0/css/ol.css';

    if (!openLayersIsInstalled) {
      openLayersIsInstalled = true; // only try to install it once
      loadCss(openLayerCssUrl, () => {});
      return from(
        new Promise<boolean>((resolve, _) => {
          loadScript(openLayerJsUrl, () => resolve(true));
        })
      );
    }
    return of(true);
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
