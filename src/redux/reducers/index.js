import { initialState } from "./stateKey";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING_TRUE":
      return { ...state, loading: true };
    case "LOADING_FALSE":
      return { ...state, loading: false };
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
        historicalData: action.payload,
      };
    case "FETCH_STATE_DATA":
      return {
        ...state,
        selectedStateGeoData: action.payload[0].selectedStateGeoData,
        selectedStateCountyCovidData:
          action.payload[1].selectedStateCountyCovidData,
        selectedStateMapData: action.payload[2].selectedStateMapData,
      };
    case "FETCH_SELECTED_STATE_CURRENT_DATA":
      return {
        ...state,
        selectedStateCurrentData: action.payload,
      };
    case "SET_MAIN_TABLE_DATA":
      return { ...state, mainTable: action.payload };
    case "SET_MAP_DATA":
      return { ...state, mapData: action.payload };
    case "SET_TOP_FIVE_TABLE":
      return { ...state, topFiveTableData: action.payload };
    case "RESET_STATE":
      return {
        ...state,
        selectedStateGeoData: [],
        selectedStateCountyCovidData: [],
        selectedStateCurrentData: [],
        selectedStateMapData: [],
      };
    default:
      return state;
  }
};

export default reducer;
