import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterModule
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url: string;
}
@Component({
  selector: 'lux-breadcrumb',
  imports: [RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class LuxBreadcrumbComponent implements OnInit, OnDestroy {
  private route = inject(Router);
  private activedRoute = inject(ActivatedRoute);

  // Signal: written from inside the router-events subscribe below (async -
  // see autocomplete.component.ts's identical rationale).
  breadcrumbs = signal<BreadcrumbItem[]>([]);
  private subs: Subscription[] = [];
  public imagePath = '../assets/img/arrow-forward.svg';

  ngOnInit(): void {
    this.subs.push(
      this.route.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((_) => {
          const acc: BreadcrumbItem[] = [];
          this.addBreadcrumbs(this.activedRoute.snapshot.root, true, null, acc);
          this.breadcrumbs.set(acc);
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  private addBreadcrumbs(
    activedRouteSnapshot: ActivatedRouteSnapshot,
    isRoot: boolean,
    urlPrefix: string | null,
    acc: BreadcrumbItem[]
  ): void {
    const routeConfig = activedRouteSnapshot.routeConfig;
    let url = urlPrefix || '';
    url += routeConfig ? '/' + this.getUrl(activedRouteSnapshot) : '';
    const label = routeConfig
      ? this.getLabel(activedRouteSnapshot)
      : isRoot
        ? 'Home'
        : '';
    if (label && url !== '/') {
      acc.push({ label, url });
    }
    if (activedRouteSnapshot.children.length) {
      this.addBreadcrumbs(activedRouteSnapshot.children[0], false, url, acc);
    }
  }

  private getUrl(activedRouteSnapshot: ActivatedRouteSnapshot): string {
    if (!activedRouteSnapshot.url[0]) {
      return '';
    }
    const id = activedRouteSnapshot.params.id;
    return id
      ? `${activedRouteSnapshot.url[0]}/${id}`
      : activedRouteSnapshot.routeConfig?.path || '';
  }

  private getLabel(
    activedRouteSnapshot: ActivatedRouteSnapshot
  ): string | null {
    const routeConfig = activedRouteSnapshot.routeConfig;
    if (!routeConfig) {
      return null;
    }
    if (activedRouteSnapshot.data && activedRouteSnapshot.data.title) {
      const data = activedRouteSnapshot.data;
      if (data.objectTitle) {
        return `${data.title} ${data.objectTitle}`;
      } else {
        return data.title;
      }
    }
    return activedRouteSnapshot.params.id || routeConfig.path;
  }
}
