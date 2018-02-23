# `react-connect-context`

With some of our internal applications at Contiamo, the [render-prop–style API of React 16.3's new Context API]((https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md) proves to be a bit limiting: [particularly the inability to use a consumed context value in component lifecycle hooks](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md#class-based-api). One solution to this is to pass the context through props.

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

// CHANGE ME TO CHANGE THE CONTEXT FOR THE WHOLE APP!
const COLOR_PASSED_THROUGH_CONTEXT = "red"

const connectContext = ContextConsumer => Component => props => (
  <ContextConsumer>{context => <Component {...context} {...props} />}</ContextConsumer>
)

class App extends React.Component {
  render() {
    return (
      <div className="demo">
        <Header>Welcome to my App!</Header>
        <ConnectedContent myProp="THIS IS MY PROP, HI!">
          Hello! I've written this component so that Magical Context-based text appears after children!
        </ConnectedContent>
      </div>
    )
  }
}

// Presentational, nested components
const Header = ({ children }) => <h1>{children}</h1>
const Content = ({ children, color, myProp }) => (
  <div>
    <p>{children}</p>
    <div>
      I have looked into context and I've seen the color is:
      <span style={{ color }}>
        {" "}
        <strong>{color}</strong>
      </span>! I also get my own props like <strong>{myProp}</strong>!
    </div>
  </div>
)

// Make a context.
const Context = React.createContext({ color: "red" })

// Pass the consumer to our function.
const ConnectedContent = connectContext(Context.Consumer)(Content)

// Render things, wrapping all in the provider.
render(
  <Context.Provider value={{ color: COLOR_PASSED_THROUGH_CONTEXT }}>
    <App />
  </Context.Provider>,
  document.querySelector("#root")
)
```

## Gotchas

The Context value _has_ to be an object since it maps to props by key/value pairs. _Be careful_ if your context is just a string, as in the [basic example from React's RFC](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md#basic-example).
