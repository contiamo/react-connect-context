# `react-connect-context`

![Tiny](https://img.shields.io/badge/size-559%20B-brightgreen.svg?compression=gzip&label=gzipped) [![Build Status](https://travis-ci.org/Contiamo/react-connect-context.svg?branch=master)](https://travis-ci.org/Contiamo/react-connect-context) [![Coverage Status](https://coveralls.io/repos/github/Contiamo/react-connect-context/badge.svg?branch=master)](https://coveralls.io/github/Contiamo/react-connect-context?branch=master)

With some of our internal applications at Contiamo, the [render-prop–style API of React 16.3's new Context API](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md) proves to be a bit limiting: [particularly the inability to use a consumed context value in component lifecycle hooks](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md#class-based-api). One solution to this is to pass an object _through context_, and then through props.

Instead of repeatedly writing "context containers" that pass context objects to container components through props that _further_ pass state to presentational components through props, this tiny function allows us to give any component easy access to a created context through props, allowing for more idiomatic, predictable code.

If a component has a prop that collides with a context-passed-through prop, the component's prop has precedence. Simple.

[Try it out!](https://codesandbox.io/s/p9rv0rp59m)

## Getting Started

1. `yarn add react-connect-context`
1. At the top of your file, `import { connectContext } from "react-connect-context"`
1. Wrap your component in the function as so: `connectContext(Context.Consumer)(MyComponent)`

### Full Example

[![Edit react-connect-context demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/p9rv0rp59m)

```jsx
import React from "react"
import { render } from "react-dom"
import { connectContext } from "react-connect-context"

// CHANGE ME TO CHANGE THE CONTEXT FOR THE WHOLE APP!
const COLOR_PASSED_THROUGH_CONTEXT = "red"

interface ContextValue {
    color: string;
}

interface ContentProps {
    myProp: string;
    color: string;
}

class App extends React.Component {
  render() {
    return (
      <div className="demo">
        <Header>Welcome to my App!</Header>
        <ConnectedContent myProp="THIS IS MY PROP, HI!" >
          Hello! I've written this component so that Magical Context-based text appears after children!
        </ConnectedContent>
      </div>
    )
  }
}

// Presentational, nested components
const Header: React.SFC = ({ children }) => <h1>{children}</h1>
const Content: React.SFC<ContentProps> = ({ children, color, myProp }) => (
  <div>
    <p>{children}</p>
    <div>
      I have looked into context and I've seen the color is:
      <span style={{ color }}>
        <strong>{color}</strong>
      </span>! I also get my own props like <strong>{myProp}</strong>!
    </div>
  </div>
)

// Make a context.
const Context = React.createContext<ContextValue>({ color: "red" })

// Pass the consumer to our function.
const ConnectedContent = connectContext<ContextValue, ContentProps>(Context.Consumer)(Content)

// Render things, wrapping all in the provider.
render(
  <Context.Provider value={{ color: COLOR_PASSED_THROUGH_CONTEXT }}>
    <App />
  </Context.Provider>,
  document.querySelector("#root")
)
```

#### Mapping context properties to props

This example shows how a context value can be mapped to a different prop name or value.

```js
const Content = ({ isRed }) => (
  <p>This pen {isRed ? "is" : "is not"} red.</p>
)

const ConnectedContent = connectContext(
  Context.Consumer,
  context => ({
    isRed: context.color === "red"
  })
)(Content)
```

#### Customizing prop merging

This example shows how you can customize the merge behavior to make context props overwrite the props passed to the component.

```js
const Content = ({ color }) => (
  <p>The pen is {color}</p>
)

const ConnectedContent = connectContext(
  Context.Consumer,
  undefined,
  (context, props) => ({ ...props, ...context })
)(Content)

// when context value is `{ color: "blue" }`:
// <ConnectedContent>The pen is blue</ConnectedContent>
// <ConnectedContent color="red">The pen is blue</ConnectedContent>
```

## API

### `connectContext<Context, ContextProps = Context>`

Factory function that creates a container component HOC to consume context `Context` and map values to match `ContextProps`.

#### Arguments

|Name|Type|Description|Default|
|:---|:---|:---|:---|
|ContextConsumer|`React.Consumer<Context>`|The React Consumer component.|*None*|
|mapContextToProps|`MapContextToProps<Context, ContextProps, OwnProps>`|A function that maps values from the consumed context value object to props to pass to the component.|`context => context`|
|mergeProps|`MergeProps<ContextProps, OwnProps, MergedProps>`|A function that merges the props that have been mapped from context values with the props passed to the connected component.|`(context, props) => ({ ...context, ...props })`|

#### Returns

|Type|Description|
|:---|:---|
|`CreateComponent<MergedProps, OwnProps>`|A HOC that returns a connected component.|

### `MapContextToProps<Context, ContextProps, OwnProps>`

A function type that maps values from the consumed context value object `Context` and props passed to the connected component `OwnProps` to a subset of the props to pass to the component `ContextProps`.

#### Arguments

|Name|Type|Description|
|:---|:---|:---|
|context|`Context`|The context value object.|
|props|`OwnProps`|The props passed to the connected component.|

#### Returns

|Type|Description|
|:---|:---|
|`ContextProps`|The props to pass to the component that could be derived from the context.|

### `MergeProps<ContextProps, OwnProps, MergedProps>`

A function that merges the props that have been mapped from context values `ContextProps` with the props passed to the connected component `OwnProps` to return all the props `MergedProps` to pass to the wrapped component.

#### Arguments

|Name|Type|Description|
|:---|:---|:---|
|context|`ContextProps`|The result of `mapContextToProps`.|
|props|`OwnProps`|The props passed to the connected component.|

#### Returns

|Type|Description|
|:---|:---|
|`MergedProps`|The complete props to pass to the wrapped component.|

### `CreateComponent<MergedProps extends ContextProps, OwnProps = Partial<MergedProps>>`

A HOC that returns a connected component that accepts props `OwnProps` and renders the given component that accepts props `MergedProps`.

#### Arguments

|Name|Type|Description|Default|
|:---|:---|:---|:---|
|Component|`React.SFC<MergedProps>`|The component to connect.|*None*|

#### Returns

|Type|Description|
|:---|:---|
|`React.SFC<OwnProps>`|A React component that will map and pass context down to the wrapped component as props.|

## Frequently Asked Questions

### Can I pick state and only re-render when necessary?

Sure. Consider using [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) or [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) to let your components know when or when _not_ to update.

Additionally, unlike [Redux](https://github.com/reactjs/redux), React 16.3 allows the creation of _multiple_, composable `Context`s, so ideally, you'd be using a `Context` that is small enough to house _just the information_ that you'd like to reuse in order to properly [separate concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) and correctly use the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when passing context around.

## Gotchas

The Context value _has_ to be an object since it maps to props by key/value pairs. _Be careful_ if your context is just a string, as in the [basic example from React's RFC](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md#basic-example). This will throw an error that will lead you here. :)

---

Made with ❤️ at [Contiamo](https://contiamo.com) in Berlin.
