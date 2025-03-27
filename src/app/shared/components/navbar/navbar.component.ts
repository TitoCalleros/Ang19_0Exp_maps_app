import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { routes } from '../../../app.routes';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  router = inject(Router);

  routes = routes.map( (route) => ({
    path: route.path,
    title: `${route.title ?? 'Mapas en Angular'}`,
  })).filter ( r => r.path !== '**');

  // El postfijo $ sirve para identificar variables de observables
  pageTitle$ = this.router.events.pipe(
    filter ((event) => event instanceof NavigationEnd),
    map ( (event) => event.url),
    map ( url => routes.find( route => `/${ route.path }` === url)?.title ?? 'Mapas')
  );

}
