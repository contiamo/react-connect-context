import * as React from "react"
import renderer from "react-test-renderer"
import { connectContext, MapContextToProps, MergeProps } from "../"
import "jest"

interface ContentProps {
  color: string
  myProp: string
}

interface ContextValue {
  color: string
}

const Context = React.createContext<ContextValue>({ color: "red" })
const Content: React.SFC<ContentProps> = ({ children, color, myProp }) => (
  <div>
    <p>{children}</p>
    <div>
      I have looked into context and I've seen the color is: {color}
      I also get my own props like {myProp}!
    </div>
  </div>
)

describe("connectContext", () => {
  it("should map context to props while preserving existing props", () => {
    const ConnectedContent = connectContext<ContextValue, ContentProps>(
      Context.Consumer
    )(Content)

    const App = () => (
      <div>
        <ConnectedContent myProp="test">Hello</ConnectedContent>
      </div>
    )

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <App />
        </Context.Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("Should use the custom mapContextToProps function if provided", () => {
    const mapContextToProps: MapContextToProps<
      ContextValue,
      ContentProps
    > = ({ color }) => {
      return ({ color: color === "green" ? "#00ff00" : color })
    }

    const ConnectedContent = connectContext(
      Context.Consumer,
      mapContextToProps
    )(Content)

    const App = () => (
      <ConnectedContent myProp="sup">
        Sup my frand
      </ConnectedContent>
    )

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <App />
        </Context.Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("Should use the custom mergeProps function if provided", () => {
    const mergeProps: MergeProps<
      ContextValue,
      ContentProps
    > = (context, props) => {
      return ({ ...props, ...context })
    }

    const ConnectedContent = connectContext(
      Context.Consumer,
      undefined,
      mergeProps
    )(Content)

    const AppWithPropsConflict = () => (
      <ConnectedContent myProp="sup" color="red">
        Sup my frand
      </ConnectedContent>
    )

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <AppWithPropsConflict />
        </Context.Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
