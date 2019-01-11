import * as React from "react";
import renderer from "react-test-renderer";
import { connectContext } from "../";
import "jest";

interface ContextType {
  color: string;
}

interface ContextPropsType {
  color: string;
}

interface OwnPropsType {
  myProp: string;
  children: React.ReactNode;
  colors?: {
    [key: string]: string
  }
}

interface MergedPropsType extends ContextPropsType, OwnPropsType {}

const Context = React.createContext<ContextType>({ color: "red" });

const Content: React.SFC<MergedPropsType> = ({ children, color, myProp }) => (
  <div>
    <p>{children}</p>
    <div>
      I have looked into context and I've seen the color is: {color}
      I also get my own props like {myProp}!
    </div>
  </div>
);

describe("connectContext", () => {
  it("should map context to props while preserving existing props", () => {
    const createContainer = connectContext<ContextType, ContextPropsType>(Context.Consumer);
    const ConnectedContent = createContainer<MergedPropsType>(Content);

    const App = () => (
      <div>
        <ConnectedContent myProp="test">Hello</ConnectedContent>
      </div>
    );

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <App />
        </Context.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should use the custom mapContextToProps function if provided", () => {
    function mapContextToProps(context: ContextType): ContextPropsType {
      return { color: context.color === "green" ? "#00ff00" : context.color };
    }

    const createContainer = connectContext<ContextType, ContextPropsType>(Context.Consumer, mapContextToProps);
    const ConnectedContent = createContainer<MergedPropsType>(Content);

    const App = () => (
      <ConnectedContent myProp="sup">
        Sup my frand
      </ConnectedContent>
    );

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <App />
        </Context.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should allow non-object context if a custom mapContextToProps function is provided", () => {
    type ContextType = string;
    const Context = React.createContext<ContextType>("red");

    function mapContextToProps(context: ContextType): ContextPropsType {
      return { color: context === "green" ? "#00ff00" : context };
    }

    const createContainer = connectContext<ContextType, ContextPropsType>(Context.Consumer, mapContextToProps);
    const ConnectedContent = createContainer<MergedPropsType>(Content);

    const App = () => (
      <ConnectedContent myProp="sup">
        Sup my frand
      </ConnectedContent>
    );

    const tree = renderer
      .create(
        <Context.Provider value="green">
          <App />
        </Context.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should also pass ownProps to mapContextToProps", () => {
    function mapContextToProps(context: ContextType, ownProps: OwnPropsType): ContextPropsType {
      return { color: ownProps.colors[context.color] || "" };
    }

    const createContainer = connectContext<ContextType, ContextPropsType>(Context.Consumer, mapContextToProps);
    const ConnectedContent = createContainer<MergedPropsType>(Content);

    const App = () => (
      <ConnectedContent colors={{ green: "#00ff00" }}>
        Sup my frand
      </ConnectedContent>
    );

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <App />
        </Context.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should use the custom mergeProps function if provided", () => {
    function mergeProps(contextProps: ContextPropsType, ownProps: OwnPropsType): MergedPropsType {
      return { ...ownProps, ...contextProps };
    }

    const createContainer = connectContext<ContextType, ContextPropsType>(
      Context.Consumer,
      null,
      mergeProps
    );
    const ConnectedContent = createContainer<MergedPropsType>(Content);

    const AppWithPropsConflict = () => (
      <ConnectedContent myProp="sup" color="red">
        Sup my frand
      </ConnectedContent>
    );

    const tree = renderer
      .create(
        <Context.Provider value={{ color: "green" }}>
          <AppWithPropsConflict />
        </Context.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should throw an error if mapContextToProps is not provided and context is not an object", () => {
    type ContextType = string;
    const Context = React.createContext<ContextType>("red");

    const createContainer = connectContext<ContextType, ContextPropsType>(Context.Consumer);
    const ConnectedContent = createContainer<MergedPropsType>(Content);

    const App = () => (
      <div>
        <ConnectedContent myProp="test">Hello</ConnectedContent>
      </div>
    );

    expect(() => {
      console.error = () => {};
      renderer.create(
        <Context.Provider value="green">
          <App />
        </Context.Provider>
      );
    }).toThrow(Error);
  });

  it("sets the displayName", () => {
    const createContainer = connectContext<ContextType, ContextPropsType>(Context.Consumer);

    const ConnectedContent1 = createContainer<MergedPropsType>(Content);
    expect(ConnectedContent1.displayName).toBe("connectContext(Content)");

    const Content2: React.SFC<MergedPropsType> = () => <div />;
    Content2.displayName = "ContentTwo";
    const ConnectedContent2 = createContainer<MergedPropsType>(Content2);
    expect(ConnectedContent2.displayName).toBe("connectContext(ContentTwo)");

    const ConnectedContent3 = createContainer<MergedPropsType>(() => <div />);
    expect(ConnectedContent3.displayName).toBe("connectContext()");
  });
});
