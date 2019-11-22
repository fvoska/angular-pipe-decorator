import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IntervalService {
  public readonly interval$ = interval(1000).pipe(tap((n) => { console.log(`Tick #${n}`)}));

  constructor() { }
}
