import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers";

// const devTools =
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

// const middleDevTools = compose(applyMiddleware(thunk), devTools);

const middleDevTools = compose(applyMiddleware(thunk));

const store = createStore(reducer, middleDevTools);

export default store;
