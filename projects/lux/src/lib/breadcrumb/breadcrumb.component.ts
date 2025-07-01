import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class LuxBreadcrumbComponent implements OnInit, OnDestroy {
  private route = inject(Router);
  private activedRoute = inject(ActivatedRoute);

  public breadcrumbs: BreadcrumbItem[];
  private subs: Subscription[] = [];
  public imagePath = '../assets/img/arrow-forward.svg';

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
