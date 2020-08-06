import {
  FETCH_CURRENT_DATA,
  FETCH_HISTORICAL_DATA,
  SET_MAIN_TABLE_DATA,
  SET_MAP_DATA,
  SET_TOP_FIVE_TABLE,
  LOADING,
} from "./actionTypes";
import axios from "axios";
import functions from "../../data-calculators";

export const setLoading = () => {
  return { type: LOADING, payload: true };
};

export const fetchCurrentData = () => async (dispatch) => {
  const [stateCurrent, usCurrent] = await Promise.all([
    axios.get("https://covidtracking.com/api/v1/states/current.json"),
    axios.get("https://covidtracking.com/api/v1/us/current.json"),
  ]);

  const payloadArray = [
    { currentStateData: stateCurrent.data },
    { currentUSData: usCurrent.data },
  ];

  dispatch({ type: FETCH_CURRENT_DATA, payload: payloadArray });
};

export const fetchHistoricalData = (state) => async (dispatch) => {
  const stateLowerCase = state.toLowerCase();

  const response =
    state === "United States"
      ? await axios.get(`https://covidtracking.com/api/v1/us/daily.json`)
      : await axios.get(
          `https://covidtracking.com/api/v1/states/${stateLowerCase}/daily.json`
        );

  dispatch({ type: FETCH_HISTORICAL_DATA, payload: response.data });
};

export const setMapData = (currentStateData, stateKey) => {
  const map = currentStateData
    .map((el) => {
      const state = stateKey.filter((abv) => {
        return abv.abbreviation === el.state;
      });
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

export const setMainTable = (currentUSData, currentStateData, stateKey) => {
  const usData = [
    {
      state: "United States",
      stateName: "United States",
      activeCases: functions.numberWithCommas(
        currentUSData[0].positive - currentUSData[0].recovered
      ),
      recoveries: functions.numberWithCommas(currentUSData[0].recovered),
      totalCases: functions.numberWithCommas(currentUSData[0].positive),
      deaths: functions.numberWithCommas(currentUSData[0].death),
    },
  ];

  const stateData = currentStateData
    .map((el) => {
      const state = stateKey.filter((abv) => {
        return abv.abbreviation === el.state;
      });
      if (state.length > 0) {
        return {
          state: el.state,
          stateName: state[0].state,
          activeCases:
            el.recovered === null
              ? functions.numberWithCommas(el.positive)
              : functions.numberWithCommas(el.positive - el.recovered),
          recoveries:
            el.recovered === null
              ? "Not Reported"
              : functions.numberWithCommas(el.recovered),
          totalCases:
            el.positive === null
              ? "Not Reported"
              : functions.numberWithCommas(el.positive),
          deaths:
            el.death === null
              ? "Not Reported"
              : functions.numberWithCommas(el.death),
        };
      } else {
        return undefined;
      }
    })
    .filter((el) => el !== undefined);

  const tableData = [...usData, ...stateData];
  return { type: SET_MAIN_TABLE_DATA, payload: tableData };
};
