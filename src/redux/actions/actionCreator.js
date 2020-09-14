import {
  FETCH_CURRENT_DATA,
  FETCH_HISTORICAL_DATA,
  SET_MAIN_TABLE_DATA,
  SET_MAP_DATA,
  SET_TOP_FIVE_TABLE,
  FETCH_STATE_DATA,
  FETCH_SELECTED_STATE_CURRENT_DATA,
  LOADING_TRUE,
  LOADING_FALSE,
  RESET_STATE,
} from "./actionTypes";
import axios from "axios";
import functions from "../../utils/index";
import getRequests from "../../utils/getRequests";

export const setLoadingTrue = () => {
  return { type: LOADING_TRUE };
};

export const setLoadingFalse = () => {
  return { type: LOADING_FALSE };
};

export const fetchCurrentData = () => async (dispatch) => {
  try {
    const [stateCurrent, usCurrent] = await Promise.all([
      getRequests.getCurrentStateData(),
      getRequests.getCurrentUSData(),
    ]);

    const payloadArray = [
      { currentStateData: stateCurrent.data },
      { currentUSData: usCurrent.data },
    ];

    dispatch({ type: FETCH_CURRENT_DATA, payload: payloadArray });
  } catch (error) {
    console.error(error);
  }
};

export const fetchSelectedStateCurrentData = (state) => async (dispatch) => {
  try {
    const response = await getRequests.getSelectedStateCurrentData(state);

    dispatch({
      type: FETCH_SELECTED_STATE_CURRENT_DATA,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
  }
};

export const fetchHistoricalData = (state) => async (dispatch) => {
  // fetches the historical covid data for a state from the API
  try {
    const stateLowerCase = state.toLowerCase();

    const response =
      state === "United States"
        ? await getRequests.getUSDailyData()
        : await getRequests.getStateDailyData(stateLowerCase);

    const RAFields = [
      "positiveIncrease",
      "deathIncrease",
      "hospitalizedIncrease",
    ];
    // calculates the 7 day rolling average using dataForge library
    const data = functions.calculateMovingAverageDataForge(
      response.data,
      7,
      RAFields
    );

    dispatch({ type: FETCH_HISTORICAL_DATA, payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const setMapData = (currentStateData, stateKey) => {
  // action to parse the current state data for the cloropleth format
  const map = currentStateData
    .map((el) => {
      // filters the statkey array for the current state
      const state = stateKey.filter((st) => {
        return st.abbreviation === el.state;
      });

      // creates the individual state object for the map
      if (state.length > 0) {
        return {
          state: el.state,
          stateName: state[0].state,
          activeCases:
            el.recovered === null ? el.positive : el.positive - el.recovered,
          recoveries: el.recovered === null ? 0 : el.recovered,
          totalCases: el.positive === null ? 0 : el.positive,
          deaths: el.death === null ? 0 : el.death,
          hospitalized:
            el.hospitalizedCurrently === null ? 0 : el.hospitalizedCurrently,
          inICU: el.inIcuCurrently === null ? 0 : el.inIcuCurrently,
        };
      } else {
        return undefined;
      }
    })
    .filter((el) => el !== undefined);

  return { type: SET_MAP_DATA, payload: map };
};

export const setTopFiveTables = (currentStateData, stateKey) => {
  // creates the top five table data
  const fivePositive = currentStateData
    .sort((a, b) => b.positive - a.positive)
    .slice(0, 5)
    .map((el) => {
      const st = stateKey.filter((abv) => abv.abbreviation === el.state);
      return {
        state: st[0].state,
        positive: functions.numberWithCommas(el.positive),
      };
    });

  const fiveDeaths = currentStateData
    .sort((a, b) => b.death - a.death)
    .slice(0, 5)
    .map((el) => {
      const st = stateKey.filter((abv) => abv.abbreviation === el.state);
      return {
        state: st[0].state,
        deaths: functions.numberWithCommas(el.death),
      };
    });

  return { type: SET_TOP_FIVE_TABLE, payload: { fivePositive, fiveDeaths } };
};

// export const setMainTable = (currentUSData, currentStateData, stateKey) => {
//   const usData = [
//     {
//       state: "United States",
//       stateName: "United States",
//       activeCases: functions.numberWithCommas(
//         currentUSData[0].positive - currentUSData[0].recovered
//       ),
//       recoveries: functions.numberWithCommas(currentUSData[0].recovered),
//       totalCases: functions.numberWithCommas(currentUSData[0].positive),
//       deaths: functions.numberWithCommas(currentUSData[0].death),
//     },
//   ];

//   const stateData = currentStateData
//     .map((el) => {
//       const state = stateKey.filter((abv) => {
//         return abv.abbreviation === el.state;
//       });
//       if (state.length > 0) {
//         return {
//           state: el.state,
//           stateName: state[0].state,
//           activeCases:
//             el.recovered === null
//               ? functions.numberWithCommas(el.positive)
//               : functions.numberWithCommas(el.positive - el.recovered),
//           recoveries:
//             el.recovered === null
//               ? "Not Reported"
//               : functions.numberWithCommas(el.recovered),
//           totalCases:
//             el.positive === null
//               ? "Not Reported"
//               : functions.numberWithCommas(el.positive),
//           deaths:
//             el.death === null
//               ? "Not Reported"
//               : functions.numberWithCommas(el.death),
//         };
//       } else {
//         return undefined;
//       }
//     })
//     .filter((el) => el !== undefined);

//   const tableData = [...usData, ...stateData];

//   return { type: SET_MAIN_TABLE_DATA, payload: tableData };
// };

export const fetchStateData = (state) => async (dispatch) => {
  // gets the state data for the state cloropleth map
  try {
    const [countyData, stateGeoData, stateMapData] = await Promise.all([
      getRequests.getStateCountyData(state),
      getRequests.getStateGeoData(state),
      getRequests.getStateMapData(state),
    ]);

    const payloadArray = [
      { selectedStateGeoData: stateGeoData.data.data.query },
      { selectedStateCountyCovidData: countyData.data.data.counties },
      { selectedStateMapData: stateMapData.data.data.query },
    ];

    dispatch({ type: FETCH_STATE_DATA, payload: payloadArray });
  } catch (error) {
    console.error(error);
  }
};

export const resetState = () => {
  // action to reset data when us map link is clicked
  return { type: RESET_STATE };
};
