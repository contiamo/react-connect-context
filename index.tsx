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
        `react-connect-context-map: The default mapContextToProps function requires the value of the context to be an
        object, but ${Component.name} received context of type ${typeof context}. Either the context shape must be
        changed, or a custom mapContextToProps function must be provided.

        More info: https://github.com/mmiller42/react-connect-context`
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
    ConnectedComponent.displayName = `connectContext(${Component.displayName || Component.name || ""})`;

    return ConnectedComponent;
  };
}
