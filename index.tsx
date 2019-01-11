import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

export type MapContextToProps<Context, ContextProps, OwnProps> = (context: Context, ownProps: OwnProps) => ContextProps;
export type MergeProps<ContextProps, OwnProps, MergedProps> =
  (contextProps: ContextProps, ownProps: OwnProps) => MergedProps;

function makeDefaultMapContextToPropsFn<
  Context,
  ContextProps,
  OwnProps,
  MergedProps
>(Component: React.SFC<MergedProps>): MapContextToProps<Context, ContextProps, OwnProps> {
  return function defaultMapContextToPropsFn<Context extends Object, ContextProps>(context: Context): ContextProps {
    if (!(context instanceof Object)) {
      throw new Error(
        `react-connect-context: the current value of the given context identifier is _not_ an object,
        and therefore cannot be passed as props to ${
        Component.name
        }. Please check the value in the context
        and try again.

        More info: https://github.com/Contiamo/react-connect-context#gotchas`
      );
    }
    return (context as any) as ContextProps;
  };
}

function makeDefaultMergePropsFn<
  ContextProps,
  OwnProps,
  MergedProps
>(): MergeProps<ContextProps, OwnProps, MergedProps> {
  return function defaultMergePropsFn<
    ContextProps,
    OwnProps,
    MergedProps
  >(contextProps: ContextProps, ownProps: OwnProps): MergedProps {
    return (Object.assign({}, contextProps, ownProps) as any) as MergedProps;
  };
}

export function connectContext<Context, ContextProps extends Object = Context>(
  ContextConsumer: React.Consumer<Context>,
  mapContextToProps: Function | void | null = null,
  mergeProps: Function | void | null = null
) {
  return function createContainer<
    MergedProps extends ContextProps,
    OwnProps = Partial<MergedProps>
  >(Component: React.SFC<MergedProps>): React.SFC<OwnProps> {
    const _mapContextToProps = (mapContextToProps as MapContextToProps<Context, ContextProps, OwnProps>)
      || makeDefaultMapContextToPropsFn<Context, ContextProps, OwnProps, MergedProps>(Component);

    const _mergeProps = (mergeProps as MergeProps<ContextProps, OwnProps, MergedProps>)
      || makeDefaultMergePropsFn<ContextProps, OwnProps, MergedProps>();

    const ConnectedComponent: React.SFC<OwnProps> = function(ownProps: OwnProps) {
      return (
        <ContextConsumer>
          {(context: Context) => React.createElement<MergedProps>(
            Component,
            Object.assign({}, _mergeProps(_mapContextToProps(context, ownProps), ownProps))
          )}
        </ContextConsumer>
      );
    };

    hoistNonReactStatics(ConnectedComponent, Component);
    ConnectedComponent.propTypes = (Component.propTypes as any) as React.ValidationMap<OwnProps>;
    ConnectedComponent.displayName = `connectContext(${Component.displayName || Component.name || ''})`;

    return ConnectedComponent;
  };
}
