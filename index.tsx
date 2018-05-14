import * as React from "react";

type MergeContextWithProps<C, P> = (context: C, props: P) => C & P;

function defaultMergeFn<C, P>(context: C, props: P): C & P {
  return Object.assign({}, context, props);
}

type Merge<L, R> = 
  /** Mandatory properties */
  Pick<L, Exclude<keyof L, keyof R>>
  /** Optional properties */
  & Partial<R>

export function connectContext<C, P>(
  ContextConsumer: React.Consumer<C>,
  mergeContextWithProps: MergeContextWithProps<C, P> = defaultMergeFn
) {
  return function(Component: React.SFC<P>) {
    return function(props: Merge<P, C>) {
      // TODO remove `as any` when is available in the react typing definition
      if (!(ContextConsumer as any).currentValue as any instanceof Object) {
        throw new Error(
          `react-connect-context: the current value of the given context identifier is _not_ an object,
        and therefore cannot be passed as props to ${
          Component.name
        }. Please check the value in the context
        and try again.

        More info: https://github.com/Contiamo/react-connect-context#gotchas`
        );
      }
      return (
        <ContextConsumer>
          {context => <Component {...mergeContextWithProps(context, props as P)} />}
        </ContextConsumer>
      );
    };
  };
}
