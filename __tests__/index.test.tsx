import * as React from "react";
import { connectContext } from "../";
import "jest";

describe("connect-context", () => {
  it("should have the correct type", () => {
    interface ContentProps {
      color: string;
      myProp: string;
    }

    interface ContextValue {
      color: string;
    }

    const Context = React.createContext<ContextValue>({ color: "red" });
    const Content: React.SFC<ContentProps> = ({ color, myProp }) => (
      <div>
        {color}: {myProp}
      </div>
    );

    const ConnectedContent = connectContext<ContextValue, ContentProps>(
      Context.Consumer
    )(Content);

    const App = () => (
      <div>
        <ConnectedContent myProp="test" />
      </div>
    );

    return (
      <Context.Provider value={{ color: "red" }}>
        <App />
      </Context.Provider>
    );
  });
});
