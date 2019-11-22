import { Subject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface IPipeDecoratorOptions {
  destroyCallbackName?: string;
  debug?: boolean;
  preventRemap?: boolean;
}

export const defaultOptions: IPipeDecoratorOptions = {
  destroyCallbackName: 'ngOnDestroy',
  debug: false,
  preventRemap: true,
}

export function Pipe(operators: Array<Function> | Function, {
  debug = defaultOptions.debug,
  destroyCallbackName = defaultOptions.destroyCallbackName,
  preventRemap = defaultOptions.preventRemap,
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

    const boxedArguments: { arguments: IArguments } = {
      arguments: null,
    };

    descriptor.value = function () {
      _this = this;
      boxedArguments.arguments = arguments;

      if (!source$) {
        if (debug) { console.log(`Creating subscription`); }
        source$ = new Subject();
        subscription = createSubscription(
          source$,
          operatorsToPipe,
          originalMethod,
          _this,
          boxedArguments,
          {
            debug,
            preventRemap,
          },
        );

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

      source$.next(boxedArguments.arguments);
    };
  };
}

function createSubscription(
  source$: Observable<IArguments>,
  operatorsToPipe: Array<Function>,
  originalMethod: Function,
  _this: any,
  boxedArguments: { arguments: IArguments },
  options: IPipeDecoratorOptions,
): Subscription {
  return source$.pipe.apply(
    source$,
    [
      ...operatorsToPipe,
      ...(options.preventRemap ? [map(() => {
        return boxedArguments.arguments;
      })] : []),
    ]
  ).subscribe((args: IArguments) => {
    if (options.debug) { console.log('Calling original handler with:', args); }
    originalMethod.apply(_this, args);
  });
}
