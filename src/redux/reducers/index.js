import { initialState } from "./stateKey";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: action.payload };
    case "FETCH_DATA":
      return { ...state, usData: action.payload };
    case "FETCH_CURRENT_DATA":
      return {
        ...state,
        currentStateData: action.payload[0].currentStateData,
        currentUSData: action.payload[1].currentUSData,
      };
    case "FETCH_HISTORICAL_DATA":
      return {
        ...state,
        currentData: action.payload,
      };
    case "SET_MAIN_TABLE_DATA":
      return { ...state, mainTable: action.payload };
    case "SET_MAP_DATA":
      return { ...state, mapData: action.payload };
    case "SET_TOP_FIVE_TABLE":
      return { ...state, topFiveTableData: action.payload };
    default:
      return state;
  }
};

export default reducer;
