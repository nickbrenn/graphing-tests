import React, { Component } from "react";
import axios from "axios";
import Dygraph from "dygraphs";
import * as d3 from "d3";

const testdata = require("./testdata.tsv");

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

    // const dygraph = new Dygraph(this.refs.chart, fetchUrl, {
    //   legend: "always"
    // });

    axios
      .get(fetchUrl)
      .then(response => {
        // console.log(response.data);
        // const keyNames = Object.keys(response.data);
        // const headData = response.data[keyNames[0]];
        // const jsonData = response.data[keyNames[1]];
        // const arr = Object.keys(jsonData).map(key => [key, jsonData[key]]);
        // console.log("new arr:", arr);
        // this.setState({ data: arr });
        const dygraph = new Dygraph(this.refs.chart, response.data, {
          // legend: "always",
          rollPeriod: 30,
          showRoller: true
        });

        console.log("dygraph:", dygraph);
      })
      .catch(error => {
        console.log("Error:", error);
        this.setState({ error: "There was an error!" });
      });
    console.log("fetchUrl = " + fetchUrl);
  };

  graphData = () => {
    var canvas = document.querySelector("canvas"),
      context = canvas.getContext("2d");

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = canvas.width - margin.left - margin.right,
      height = canvas.height - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime().range([0, width]);

    var y = d3.scaleLinear().range([height, 0]);

    var line = d3
      .line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.close);
      })
      .curve(d3.curveStep)
      .context(context);

    context.translate(margin.left, margin.top);

    d3.tsv(testdata, function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      return d;
    }).then(function(data) {
      x.domain(
        d3.extent(data, function(d) {
          return d.date;
        })
      );
      y.domain(
        d3.extent(data, function(d) {
          return d.close;
        })
      );

      xAxis();
      yAxis();

      context.beginPath();
      line(data);
      context.lineWidth = 1.5;
      context.strokeStyle = "steelblue";
      context.stroke();
    });

    function xAxis() {
      var tickCount = 10,
        tickSize = 6,
        ticks = x.ticks(tickCount),
        tickFormat = x.tickFormat();

      context.beginPath();
      ticks.forEach(function(d) {
        context.moveTo(x(d), height);
        context.lineTo(x(d), height + tickSize);
      });
      context.strokeStyle = "black";
      context.stroke();

      context.textAlign = "center";
      context.textBaseline = "top";
      ticks.forEach(function(d) {
        context.fillText(tickFormat(d), x(d), height + tickSize);
      });
    }

    function yAxis() {
      var tickCount = 10,
        tickSize = 6,
        tickPadding = 3,
        ticks = y.ticks(tickCount),
        tickFormat = y.tickFormat(tickCount);

      context.beginPath();
      ticks.forEach(function(d) {
        context.moveTo(0, y(d));
        context.lineTo(-6, y(d));
      });
      context.strokeStyle = "black";
      context.stroke();

      context.beginPath();
      context.moveTo(-tickSize, 0);
      context.lineTo(0.5, 0);
      context.lineTo(0.5, height);
      context.lineTo(-tickSize, height);
      context.strokeStyle = "black";
      context.stroke();

      context.textAlign = "right";
      context.textBaseline = "middle";
      ticks.forEach(function(d) {
        context.fillText(tickFormat(d), -tickSize - tickPadding, y(d));
      });

      context.save();
      context.rotate(-Math.PI / 2);
      context.textAlign = "right";
      context.textBaseline = "top";
      context.font = "bold 10px sans-serif";
      context.fillText("Price (US$)", -10, 10);
      context.restore();
    }
  };

  componentDidMount = () => {
    // this.fetchData();
    this.graphData();
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
            <canvas width="960" height="500" />
            {/* <div ref="chart" /> */}
          </div>
        </div>
      );
    }
  }
}

export default DataView;
