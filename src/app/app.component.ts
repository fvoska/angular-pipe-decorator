import { Component, HostListener } from '@angular/core';
import { debounceTime, distinctUntilChanged, auditTime } from 'rxjs/operators';
import { Pipe, IParamsWithContext } from './pipe.decorator';

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
    distinctUntilChanged<IParamsWithContext>((prevParams, currentParams) => {
      const prevValue = prevParams.arguments[0];
      const currentValue = currentParams.arguments[0];

      // currentParams.arguments[1] is value of someExtraStuff

      return prevValue === currentValue;
    }),
  ])
  public pipedOnInputChanged(value: string, someExtraStuff: number = 100): void {
    console.log(`\n${value}`);
    console.log('meaning: ', this.meaning);
    console.log('extra stuff: ', someExtraStuff);
  }
}
