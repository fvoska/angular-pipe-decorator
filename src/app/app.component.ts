import { Component } from '@angular/core';
import { IntervalService } from './services/interval/interval.service';

@Component({
  selector: 'app-root',
  template: `
    <a routerLink="/">Home</a> |
    <a routerLink="/search">Search</a> |
    <a routerLink="/resize-listener">Resize Listener</a>

    <hr>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private interval: IntervalService) {
    // this.interval.interval$.subscribe();
  }
}
