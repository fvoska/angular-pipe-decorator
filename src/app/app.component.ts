import { Component, HostListener } from '@angular/core';
import { debounceTime, distinctUntilChanged, auditTime } from 'rxjs/operators';
import { Pipe, IContextWithArguments } from './pipe.decorator';

@Component({
  selector: 'app-root',
  template: `
    Value: <input (input)="pipedOnInputChanged($event.target.value, 200)">
    <hr>
    Try resizing as well!
  `,
})
export class AppComponent {
  public meaning = 42;

  @Pipe(auditTime(1000))
  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event) {
    const w: Window = event.target as Window;
    console.log('window resized', w.outerWidth, w.outerHeight);
  }

  @Pipe([
    debounceTime(250),
    distinctUntilChanged<IContextWithArguments>((prevParams, currentParams) => {
      // Operators passed to the Pipe decorator work on stream of IParamsWithContext objects.

      // Make sure not to map the stream to something else, or else wrapped calls to original method will not work.

      // We need to provide a custom comparison function because functions can have multiple arguments (like value and someExtraStuff), so the defalt shallow comparison will always determine that previous and current IParamsWithContext objects are different. We instead need to get the desired function argument to compare, in this case it is the first argument which contains the value of the input. We could in theory take other arguments into consideration if necessary.

      // When doing the "old-fashioned" debouncing with .next and .subscribe inside component the reason why we do not have to provide a custom comparison function in distinctUntilChanged() is because we are nexting only one value and the stream will work with one value, whereas Pipe operator works with multiple values.

      const prevValue = prevParams.arguments[0];
      const currentValue = currentParams.arguments[0];

      // currentParams.arguments[1] is value of someExtraStuff

      return prevValue === currentValue;
    }),
  ])
  public pipedOnInputChanged(value: string, someExtraStuff: number = 100): void {
    //                       arguments[0]   arguments[1]

    console.log(`\n${value}`);
    console.log('meaning: ', this.meaning);
    console.log('extra stuff: ', someExtraStuff);
  }
}
