import React from "react"

const defaultMergeFn = (context, props) => Object.assign({}, context, props)

export const connectContext = (
  ContextConsumer,
  mergeContextWithProps = defaultMergeFn
) => Component => props => {
  if (!ContextConsumer.currentValue instanceof Object) {
    throw new Error(
      `react-connect-context: the current value of the given context identifier is _not_ an object,
    and therefore cannot be passed as props to ${
      Component.name
    }. Please check the value in the context
    and try again.

    More info: https://github.com/Contiamo/react-connect-context#gotchas`
    )
  }
  return (
    <ContextConsumer>
      {context => <Component {...mergeContextWithProps(context, props)} />}
    </ContextConsumer>
  )
}
