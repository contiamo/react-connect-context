import React from 'react'

function recursiveConsume(Consumers, Component, props = {}) {
  if (!Array.isArray(Consumers)) {
    return <Component />
  }

  const Consumer = Consumers.shift()

  return (
    <Consumer>
      { context => (
        Consumers.length === 0 ? <Component {...Object.assign({}, context, props)} />
          : recursiveConsume(Consumers, Component, Object.assign({}, context, props))
      )}
    </Consumer>
  )
}

export default (Consumer, ...otherConsumers) => Component => props => (
  recursiveConsume([Consumer, ...otherConsumers], Component, props)
)
