import React from "react"

export const connectContext = ContextConsumer => Component => props => {
  if (!ContextConsumer.currentValue instanceof Object) {
    throw new Error(`react-connect-context: the current value of the given context identifier is _not_ an object,
and therefore cannot be passed as props to ${Component.name}. Please check the value in the context
and try again.

More info: https://github.com/Contiamo/react-connect-context#gotchas`)
  }
  return <ContextConsumer>{context => <Component {...context} {...props} />}</ContextConsumer>
}
