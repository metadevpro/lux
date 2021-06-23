import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  url: string;
}
@Component({
  selector: 'lux-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class LuxBreadcrumbComponent implements OnInit, OnDestroy {
  public breadcrumbs: BreadcrumbItem[];
  private subs: Subscription[] = [];
  public imagePath = '../assets/img/arrow-forward.svg';

  constructor(private route: Router, private activedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.subs.push(
      this.route.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((_) => {
          this.breadcrumbs = [];
          this.addBreadcrumbs(this.activedRoute.snapshot.root, true, null);
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
    urlPrefix: string
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
      const breadcrumb = { label, url };
      this.breadcrumbs.push(breadcrumb);
    }
    if (activedRouteSnapshot.children.length) {
      this.addBreadcrumbs(activedRouteSnapshot.children[0], false, url);
    }
  }

  private getUrl(activedRouteSnapshot: ActivatedRouteSnapshot): string {
    if (!activedRouteSnapshot.url[0]) {
      return '';
    }
    const id = activedRouteSnapshot.params.id;
    return id
      ? `${activedRouteSnapshot.url[0]}/${id}`
      : activedRouteSnapshot.routeConfig.path || '';
  }

  private getLabel(activedRouteSnapshot: ActivatedRouteSnapshot): string {
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
