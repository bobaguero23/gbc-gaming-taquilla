import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware";
import { connect } from "redux-zero/devtools";
import DEFAULT from "./Store.Default";

const middlewares = connect ? applyMiddleware(connect(DEFAULT)) : [];
const store = createStore(DEFAULT, middlewares);

export default store;