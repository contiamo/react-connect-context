import * as React from "react";

type MergeContextWithProps<C, P> = (context: C, props: P) => C & P;

function defaultMergeFn<C, P>(context: C, props: P): C & P {
  return Object.assign({}, context, props);
}

type Merge<T, U> = U & (T extends U ? Partial<T> : T);

export function connectContext<C, P>(
  ContextConsumer: React.Consumer<C>,
  mergeContextWithProps: MergeContextWithProps<C, P> = defaultMergeFn
): (Component: React.SFC<P & C>) => React.SFC<P> {
  // Here we have a real challenge, the component props type should have
  // all the original component props with an overide by the context
  // so something like SFC<C extends Partial<P>>
  return function(Component: React.SFC<Merge<C, P>>): React.SFC<P> {
    return function(props: P): JSX.Element {
      // if (!ContextConsumer.currentValue instanceof Object) {
      //   throw new Error(
      //     `react-connect-context: the current value of the given context identifier is _not_ an object,
      //   and therefore cannot be passed as props to ${
      //     Component.name
      //   }. Please check the value in the context
      //   and try again.

      //   More info: https://github.com/Contiamo/react-connect-context#gotchas`
      //   );
      // }
      return (
        <ContextConsumer>
          {context => <Component {...mergeContextWithProps(context, props)} />}
        </ContextConsumer>
      );
    };
  };
}
