import React, { Component } from "react";
import axios from "axios";
import Dygraph from "dygraphs";

const apikey = require("../config/keys.json").alphavantage_apikey;
const baseUrl = "https://www.alphavantage.co/query?";

class DataView extends Component {
  state = {
    // symbol: "MSFT",
    function: "FX_INTRADAY",
    from_symbol: "EUR",
    to_symbol: "USD",
    interval: "5min",
    outputsize: "full",
    datatype: "csv",
    data: null
  };

  fetchData = () => {
    let fetchUrl = baseUrl;
    // this.state.symbol ? (fetchUrl += `&symbol=${this.state.symbol}`) : null;
    this.state.function
      ? (fetchUrl += `&function=${this.state.function}`)
      : null;
    this.state.from_symbol
      ? (fetchUrl += `&from_symbol=${this.state.from_symbol}`)
      : null;
    this.state.to_symbol
      ? (fetchUrl += `&to_symbol=${this.state.to_symbol}`)
      : null;
    this.state.interval
      ? (fetchUrl += `&interval=${this.state.interval}`)
      : null;
    this.state.outputsize
      ? (fetchUrl += `&outputsize=${this.state.outputsize}`)
      : null;
    this.state.datatype
      ? (fetchUrl += `&datatype=${this.state.datatype}`)
      : null;
    apikey ? (fetchUrl += `&apikey=${apikey}`) : null;

    new Dygraph(this.refs.chart, fetchUrl, {
      legend: "always"
    });
    // axios
    //   .get(fetchUrl)
    //   .then(response => {
    //     const keyNames = Object.keys(response.data);
    //     const headData = response.data[keyNames[0]];
    //     const jsonData = response.data[keyNames[1]];
    //     const arr = Object.keys(jsonData).map(key => [key, jsonData[key]]);
    //     this.setState({ data: arr });
    //   })
    //   .catch(error => {
    //     console.log("Error:", error);
    //     this.setState({ error: "There was an error!" });
    //   });
    console.log("fetchUrl = " + fetchUrl);
  };

  componentDidMount = () => {
    this.fetchData();
  };

  render() {
    if (this.state.data !== null) {
      return (
        <div>
          {this.state.data.map((datapoint, index) => {
            return (
              <div key={index}>
                {datapoint[0]}
                {Object.keys(datapoint[1]).map((key, index) => {
                  return (
                    <div key={key + index}>
                      {key}
                      {": "}
                      {datapoint[1][key]}
                    </div>
                  );
                })}
                {"================"}
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="DataView">
          <header className="DataView-header">
            <h1 className="DataView-title">Welcome to Graphing-test :)</h1>
          </header>
          <p className="DataView-intro">This is your api key: {apikey}</p>
          <div className="graph">
            <div ref="chart" />
          </div>
        </div>
      );
    }
  }
}

export default DataView;
