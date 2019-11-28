import { Component, HostListener } from '@angular/core';
import { auditTime } from 'rxjs/operators';
import { Pipe } from '../../pipe.decorator';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-resize-listener',
  templateUrl: './resize-listener.component.html',
  styleUrls: ['./resize-listener.component.scss']
})
export class ResizeListenerComponent {
  dimentions$ = new BehaviorSubject({
    w: window.outerWidth,
    h: window.outerHeight,
  });

  @Pipe(auditTime(250))
  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event) {
    const w: Window = event.target as Window;

    console.log('Window resized', w.outerWidth, w.outerHeight);

    this.dimentions$.next({
      w: w.outerWidth,
      h: w.outerHeight
    });

  }
}
