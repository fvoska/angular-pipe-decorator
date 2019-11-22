import { Component } from '@angular/core';
import { IntervalService } from './services/interval/interval.service';

@Component({
  selector: 'app-root',
  template: `
    <a routerLink="/">Home</a>
    <a routerLink="/search-1">Search 1</a>
    <a routerLink="/search-2">Search 2</a>

    <hr>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private interval: IntervalService) {
    // this.interval.interval$.subscribe();
  }
}
