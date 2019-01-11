import * as React from "react";

export type MapContextToProps<C, P> = (context: C) => Partial<P>;
export type MergeProps<P> = (context: Partial<P>, props: Partial<P>) => P;
export type CreateComponent<P> = (Component: React.SFC<P>) => React.SFC<Partial<P>>;

function defaultMapContextToPropsFn<C, P>(context: C): Partial<P> {
  return context as Partial<P>;
}

function defaultMergePropsFn<P>(context: Partial<P>, props: Partial<P>): P {
  return Object.assign({}, context, props) as P;
}

export function connectContext<C, P>(
  ContextConsumer: React.Consumer<C>,
  mapContextToProps: MapContextToProps<C, P> = defaultMapContextToPropsFn,
  mergeProps: MergeProps<P> = defaultMergePropsFn
): CreateComponent<P> {
  return function(Component: React.SFC<P>) {
    return function(props: Partial<P>) {
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
          {(context: C) => <Component {...mergeProps(mapContextToProps(context, props), props)} />}
        </ContextConsumer>
      );
    };
  };
}
