import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers";

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

let middleDevTools;
if (process.env.NODE_ENV === "development") {
  middleDevTools = compose(applyMiddleware(thunk), devTools);
} else {
  middleDevTools = compose(applyMiddleware(thunk));
}
const store = createStore(reducer, middleDevTools);

export default store;
