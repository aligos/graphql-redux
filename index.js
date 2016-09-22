import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { queryReducer } from "./app/reducers/reducers.js";
import thunkMiddleware from "redux-thunk";
import { QueryContainer } from './app/components/Query.js';

const Main = () => (
    <div>
      <QueryContainer />
    </div>
);

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

render(
  <Provider store={createStoreWithMiddleware(queryReducer)}>
    <Main />
  </Provider>,
  document.getElementById("example")
);