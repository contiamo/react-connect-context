import * as React from "react";

export type MapContextToProps<Context, ContextProps, OwnProps> = (context: Context, props: OwnProps) => ContextProps;
export type MergeProps<ContextProps, OwnProps, MergedProps> = (context: ContextProps, props: OwnProps) => MergedProps;

function defaultMapContextToPropsFn<Context, ContextProps>(context: Context): ContextProps {
  return (context as any) as ContextProps;
}

function defaultMergePropsFn<ContextProps, OwnProps, MergedProps>(context: ContextProps, props: OwnProps): MergedProps {
  return (Object.assign({}, context, props) as any) as MergedProps;
}

export function connectContext<Context, ContextProps = Context>(
  ContextConsumer: React.Consumer<Context>,
  mapContextToProps: Function = defaultMapContextToPropsFn,
  mergeProps: Function = defaultMergePropsFn
) {
  return function<
    MergedProps extends ContextProps,
    OwnProps = Partial<MergedProps>
  >(Component: React.SFC<MergedProps>): React.SFC<OwnProps> {
    const _mapContextToProps = mapContextToProps as MapContextToProps<Context, ContextProps, OwnProps>;
    const _mergeProps = mergeProps as MergeProps<ContextProps, OwnProps, MergedProps>;

    return function(props: OwnProps) {
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
          {(context: Context) => <Component {..._mergeProps(_mapContextToProps(context, props), props)} />}
        </ContextConsumer>
      );
    };
  };
}
