import { Component, OnDestroy, HostListener, Input, OnChanges, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, auditTime } from 'rxjs/operators';
import { Pipe } from '../../pipe.decorator';
import { IntervalService } from '../../services/interval/interval.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  public meaning = 42;
  private sub: Subscription;

  constructor(interval: IntervalService) {
    this.sub = interval.interval$.subscribe((n) => {
      this.processTick(n);
    })
  }

  @Pipe([
    debounceTime(250),
    distinctUntilChanged<IArguments>((prevParams, currentParams) => {
      // Operators passed to the Pipe decorator work on stream of IArguments objects.

      // If you are using maping operators, make sure to maintain IArguments as final result.

      // We need to provide a custom comparison function because functions can have multiple arguments (like value and someExtraStuff), so the defalt shallow comparison will always determine that previous and current IArguments objects are different. We instead need to get the desired function argument to compare, in this case it is the first argument which contains the value of the input. We could in theory take other arguments into consideration if necessary.

      // When doing the "old-fashioned" debouncing with .next and .subscribe inside component the reason why we do not have to provide a custom comparison function in distinctUntilChanged() is because we are nexting only one value and the stream will work with one value, whereas @Pipe decorator works with multiple values.
      // currentParams[1] is value of someExtraStuff

      return prevParams[0] === currentParams[0] && prevParams[1] === currentParams[1];
    }),
    // map(([value, extra]) => [value * 100, extra])
    tap(function() {
      console.log('This:', this);
    }),
    tap(() => {
      console.log('Arrow this:', this);
    })
  ], { debug: false })
  public pipedOnInputChanged(value: string, someExtraStuff: number): void {
    //                       arguments[0]   arguments[1]

    console.log(`\n${value}`);
    console.log('meaning: ', this.meaning);
    console.log('extra stuff: ', someExtraStuff);
  }

  @Pipe(auditTime(1000), { debug: true })
  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event) {
    const w: Window = event.target as Window;
    console.log('Window resized', w.outerWidth, w.outerHeight);
  }

  @Pipe(auditTime(2500))
  private processTick(n: number): void {
    console.log('Got tick: ', n);
  }

  public ngOnDestroy(): void {
    console.log('Component destroyed');
    this.sub.unsubscribe();
  }
}
