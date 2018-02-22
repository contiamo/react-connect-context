import React from "react"
import renderer from "react-test-renderer"

import { connectContext } from "../"
const Context = React.createContext({ color: "red" })
const Header = ({ children }) => <h1>{children}</h1>
const Content = ({ children, color, myProp }) => (
  <div>
    <p>{children}</p>
    <div>
      I have looked into context and I've seen the color is: {color}
      I also get my own props like {myProp}!
    </div>
  </div>
)

const ConnectedContent = connectContext(Context.Consumer)(Content)

class App extends React.Component {
  render() {
    return (
      <div>
        <Header>Welcome to my App!</Header>
        <ConnectedContent myProp="sup">Sup my frand</ConnectedContent>
      </div>
    )
  }
}

describe("connectContext", () => {
  it("Should map context to props while preserving existing props", () => {
    const tree = renderer
      .create(
        <Context.Provider value={{ color: "red" }}>
          <App />
        </Context.Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
