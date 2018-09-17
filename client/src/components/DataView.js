import React, { Component } from 'react';
import axios from "axios";

const apikey = require("../config/keys.json").alphavantage_apikey;
const baseUrl = "https://www.alphavantage.co/query?"

class DataView extends Component {
  state = {
    url: `${baseUrl}function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${apikey}`,
    symbol: "MSFT",
    function: "TIME_SERIES_INTRADAY",
    interval: "1min",
    outputsize: "compact",
    datatype: "json",
    data: null
  }

  fetchData = () => {
    let fetchUrl = baseUrl;
    this.state.symbol ? fetchUrl += `&symbol=${this.state.symbol}` : null;
    this.state.function ? fetchUrl += `&function=${this.state.function}` : null;
    this.state.interval ? fetchUrl += `&interval=${this.state.interval}` : null;
    this.state.outputsize ? fetchUrl += `&outputsize=${this.state.outputsize}` : null;
    this.state.datatype ? fetchUrl += `&datatype=${this.state.datatype}` : null;
    apikey ? fetchUrl += `&apikey=${apikey}` : null;

    axios
      .get(fetchUrl)
      .then(response => {
        const keyNames = Object.keys(response.data);
        const headData = response.data[keyNames[0]];
        const jsonData = response.data[keyNames[1]];
        const arr = Object.keys(jsonData).map((key) => [key, jsonData[key]]);
        this.setState({ data:  arr  })
      })
      .catch(error => {
        console.log("Error:", error);
        this.setState({ error: "There was an error!" });
      })

    console.log("fetchUrl = " + fetchUrl);
  }
  
  componentDidMount = () => {
    this.fetchData();
  }

  render() {
    if(this.state.data !== null){
      return (
        <div>
          {this.state.data.map((datapoint, index) => {
            return (
              <div key={index}>
                {datapoint[0]}
                {Object.keys(datapoint[1]).map((key,index) => {
                  return (
                    <div key={key+index}>
                      {key}{": "}{datapoint[1][key]}
                    </div>
                  );  
                })}
              </div>
            )
          })}
        </div>
      )
    } else {
      return (
        <div className="DataView">
          <header className="DataView-header">
            <h1 className="DataView-title">Welcome to React</h1>
          </header>
          <p className="DataView-intro">
            This is your api key: {apikey}
          </p>
        </div>
      );
    }
  }
}

export default DataView;
