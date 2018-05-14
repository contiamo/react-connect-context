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

## Frequently Asked Questions

### Can I pick state and only re-render when necessary?

Sure. Consider using [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) or [`shouldComponentUpdate`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) to let your components know when or when _not_ to update.

Additionally, unlike [Redux](https://github.com/reactjs/redux), React 16.3 allows the creation of _multiple_, composable `Context`s, so ideally, you'd be using a `Context` that is small enough to house _just the information_ that you'd like to reuse in order to properly [separate concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) and correctly use the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when passing context around.

### Can I map my context object's properties to _different_ props on my component?

For now, _no_. This particular tool is designed to provide a nice cascade of props: if a component has a prop on it, like `color` from the above example, _that_ prop is used. If it doesn't have a prop, but the prop exists on a `Context`, _its_ prop is used.

I would again toot the horn of using multiple small contexts here as above.

## Gotchas

The Context value _has_ to be an object since it maps to props by key/value pairs. _Be careful_ if your context is just a string, as in the [basic example from React's RFC](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md#basic-example). This will throw an error that will lead you here. :)

---

Made with ❤️ at [Contiamo](https://contiamo.com) in Berlin.
