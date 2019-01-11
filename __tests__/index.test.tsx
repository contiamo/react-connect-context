import * as React from "react"
import renderer from "react-test-renderer"
import { connectContext } from "../"
import "jest"

interface ContextValue {
  color: string
}

interface MappedContextProps {
  color: string
}

interface OwnProps {
  myProp: string
  children: string
}

interface ContentProps extends MappedContextProps, OwnProps {}

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
    const hoc = connectContext<ContextValue, MappedContextProps>(
      Context.Consumer
    )

    const ConnectedContent = hoc<ContentProps>(Content)

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
    function mapContextToProps(context: ContextValue): MappedContextProps {
      return { color: context.color === "green" ? "#00ff00" : context.color };
    };

    const hoc = connectContext<ContextValue, MappedContextProps>(
      Context.Consumer,
      mapContextToProps
    );

    const ConnectedContent = hoc<ContentProps>(Content)

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
    function mergeProps(context: MappedContextProps, props: OwnProps): ContentProps {
      return { ...props, ...context };
    }

    const hoc = connectContext<ContextValue, MappedContextProps>(
      Context.Consumer,
      undefined,
      mergeProps
    );

    const ConnectedContent = hoc<ContentProps>(Content)

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
