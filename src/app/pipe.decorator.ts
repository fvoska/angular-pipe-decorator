import { Subject, Observable, Subscription } from 'rxjs';

interface IPipeDecoratorOptions {
  destroyCallbackName?: string;
  debug?: boolean;
}

export const defaultOptions: IPipeDecoratorOptions = {
  destroyCallbackName: 'ngOnDestroy',
  debug: false,
}

export function Pipe(operators: Array<Function> | Function, {
  debug = defaultOptions.debug,
  destroyCallbackName = defaultOptions.destroyCallbackName,
} = defaultOptions) {
  return function (
    target: any, // Object's prototype
    propertyKey: string, // Key of the member that we are decorating
    descriptor: PropertyDescriptor, // Property descriptor
  ) {
    if (debug) { console.log(`Decorated ${target.constructor.name}.${propertyKey}`); }
    const originalMethod: Function = descriptor.value;

    let _this: any;
    let source$: Subject<IArguments>;
    let subscription: Subscription;

    let operatorsToPipe: Array<Function>;
    if (operators instanceof Array) {
      operatorsToPipe = operators;
    } else if (typeof operators === 'function') {
      operatorsToPipe = [operators];
    }

    descriptor.value = function () {
      _this = this;

      if (!source$) {
        if (debug) { console.log(`Creating subscription`); }
        source$ = new Subject();
        subscription = createSubscription(source$, operatorsToPipe, originalMethod, _this, debug);

        const originalDestroy: Function = target[destroyCallbackName];
        target[destroyCallbackName] = function() {
          if (debug) { console.log('Unsubscribed'); }
          subscription.unsubscribe();
          source$ = null;

          if (originalDestroy) {
            originalDestroy.call(this);
          }
        }
      }

      source$.next(arguments);
    };
  };
}

function createSubscription(
  source$: Observable<IArguments>,
  operatorsToPipe: Array<Function>,
  originalMethod: Function,
  _this: any,
  debug: boolean,
): Subscription {
  return source$.pipe.apply(
    source$,
    operatorsToPipe,
  ).subscribe((args: IArguments) => {
    if (debug) { console.log('Calling original handler with:', args); }
    originalMethod.apply(_this, args);
  });
}
