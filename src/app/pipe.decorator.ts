import { Subject } from 'rxjs';

export interface IContextWithArguments {
  context: any;
  arguments: IArguments;
}

export function Pipe(operators: Array<Function> | Function) {
  return function (
    target: any, // Object's prototype
    propertyKey: string, // Key of the member that we are decorating
    descriptor: PropertyDescriptor, // Property descriptor
  ) {
    const originalMethod: Function = descriptor.value;

    const source$: Subject<IContextWithArguments
  > = new Subject();

    let operatorsToPipe: Array<Function>;
    if (operators instanceof Array) {
      operatorsToPipe = operators;
    } else if (typeof operators === 'function') {
      operatorsToPipe = [operators];
    }

    source$.pipe.apply(source$, operatorsToPipe).subscribe((paramsWithContext: IContextWithArguments) => {
      originalMethod.apply(paramsWithContext.context, paramsWithContext.arguments);
    });

    descriptor.value = function () {
      source$.next({
        context: this,
        arguments,
      });
    };
  };
}
