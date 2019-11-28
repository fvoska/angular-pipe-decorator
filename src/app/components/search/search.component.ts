import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';
import { Pipe } from '../../pipe.decorator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  public meaning = 42;

  @Pipe([
    debounceTime(250),
    distinctUntilChanged<IArguments>((prevParams, currentParams) => {
      /* Operators passed to the Pipe decorator work on stream of IArguments objects.

      If you are using maping operators, make sure to maintain IArguments as final result.

      We need to provide a custom comparison function because functions can have multiple arguments
      (like value and someExtraStuff), so the defalt shallow comparison will always determine that
      previous and current IArguments objects are different. We instead need to get the desired function
      argument to compare, in this case it is the first argument which contains the value of the input.
      We could in theory take other arguments into consideration if necessary.

      When doing the "old-fashioned" debouncing with .next and .subscribe inside component the reason
      why we do not have to provide a custom comparison function in distinctUntilChanged() is because
      we are nexting only one value and the stream will work with one value, whereas @Pipe decorator
      works with multiple values. currentParams[1] is value of someExtraStuff
      */

      return prevParams[0] === currentParams[0] && prevParams[1] === currentParams[1];
    }),
    tap({
      next: function() { console.log(this); },
    }),
    tap(() => console.log(this)),
    map(([value, extra]) => [value * 100, extra]),
  ])
  public pipedOnInputChanged(value: string, someExtraStuff: number): void {
    //                       arguments[0]   arguments[1]

    console.log(`\n${value}`);
    console.log('meaning: ', this.meaning);
    console.log('extra stuff: ', someExtraStuff);
  }
}
