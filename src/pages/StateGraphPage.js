import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoricalData } from "../redux/actions/actionCreator";

import "./USPage.css";
import Title from "../components/Title";
// import LineChart from "../visualizations/LineChart";
import functions from "../utils";
import Loader from "../components/Loader";

const USPage = ({ stateId }) => {
  const dispatch = useDispatch();
  const currentData = useSelector((state) => state.currentData);
  const stateKey = useSelector((state) => state.stateKey);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentData || currentData.state !== stateId) {
      setLoading(true);
      dispatch(fetchHistoricalData(stateId));
    }
  }, []);

  useEffect(() => {
    if (!currentData) return;
    window.scrollTo(0, 0);
    const dataFormatted = currentData.map((el) => {
      return {
        ...el,
        date: functions.formatDate(el.date),
        activeCases: el.positive - el.recovered,
      };
    });

    const reversedData = dataFormatted.slice().reverse();

    const movingAverageFieldsArray = [
      "positive",
      "positiveIncrease",
      "recovered",
      "hospitalized",
      "deathIncrease",
      "activeCases",
    ];

    movingAverageFieldsArray.forEach((el) => {
      setData(functions.calculateMovingAverage(reversedData, 7, el));
      setData(functions.calculateMovingAverage(reversedData, 14, el));
    });

    setData(reversedData);
    setLoading(false);
  }, [currentData]);

  const renderTitles = !currentData ? null : (
    <>
      <Title
        className="us-data"
        data={functions.numberWithCommas(
          currentData[0].positive - currentData[0].recovered
        )}
      >
        Active Cases:{" "}
      </Title>
      <Title
        className="us-data"
        data={functions.numberWithCommas(currentData[0].recovered)}
      >
        Recoveries:{" "}
      </Title>

      <Title
        className="us-data"
        data={functions.numberWithCommas(currentData[0].positive)}
      >
        Positive Tests:{" "}
      </Title>

      <Title
        className="us-data"
        data={functions.numberWithCommas(currentData[0].negative)}
      >
        Negative Tests:{" "}
      </Title>

      <Title
        className="us-data"
        data={functions.numberWithCommas(
          currentData[0].positive + currentData[0].negative
        )}
      >
        Total Tests:{" "}
      </Title>
      <Title
        className="us-data"
        data={functions.numberWithCommas(currentData[0].death)}
      >
        Deaths:{" "}
      </Title>
    </>
  );

  const stateTitle = () => {
    if (!currentData) {
      return null;
    } else if (stateId === "United States") {
      return "United States";
    } else {
      const key = stateKey.filter((el) => el.abbreviation === stateId);

      return key[0].state;
    }
  };

  return (
    <div className="page-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="page-title">{stateTitle()} COVID-19 Data</h1>
          <div className="title-container">{renderTitles}</div>
          <div className="chart-container">
            <LineChart
              data={data}
              graphData={"activeCases"}
              name="activeCases"
              color={"#132E36"}
              title="Active Cases"
            />
            <LineChart
              data={data}
              graphData={"recovered"}
              name="recovered"
              color="blue"
              title="Total Recoveries"
            />
            <LineChart
              data={data}
              graphData={"positive"}
              name="positive"
              color={"#132E36"}
              title="Postive Tests"
            />
            <LineChart
              data={data}
              graphData={"positiveIncrease"}
              secondLine={"positiveIncreaseMovingAverage7"}
              thirdLine={"positiveIncreaseMovingAverage14"}
              name="positiveIncrease"
              color={"#C94343"}
              secondaryColor={"#B67DF1"}
              thirdColor={"rgb(41.5%, 0.3%, 46.4%)"}
              title="Daily Increase in Positive Tests"
            />
            <LineChart
              data={data}
              graphData={"negative"}
              name="negative"
              color="blue"
              title="Negative Tests"
            />
            <LineChart
              data={data}
              graphData={"negativeIncrease"}
              name="negativeIncrease"
              color="blue"
              title="Daily Increase in Negative Tests"
            />
            <LineChart
              data={data}
              graphData={"death"}
              name="death"
              color="red"
              title="Total Deaths"
            />
            <LineChart
              data={data}
              graphData={"deathIncrease"}
              secondLine={"deathIncreaseMovingAverage7"}
              thirdLine={"deathIncreaseMovingAverage14"}
              name="deathIncrease"
              color={"#C94343"}
              secondaryColor={"#B67DF1"}
              thirdColor={"rgb(41.5%, 0.3%, 46.4%)"}
              title="Daily Deaths"
            />
          </div>
          <h6>
            Data provided through The COVID Tracking Project at The Atlantic, as
            of {currentData ? functions.formatDate(currentData[0].date) : null}
          </h6>
        </>
      )}
    </div>
  );
};

export default USPage;
