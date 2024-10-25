import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about",
      "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this",
      "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours",
      "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it",
      "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me",
      "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am",
      "are", "be", "been", "being", "have", "has", "had", "having", "do", "does",
      "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which",
      "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through",
      "over", "under", "above", "below", "between", "among", "during", "before", "after", "until",
      "while", "of", "for", "on", "off", "out", "in", "into", "by", "about",
      "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't",
      "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't",
      "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't",
    ]);
    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");
    const filteredWords = words.filter((word) => !stopWords.has(word));
    return Object.entries(
      filteredWords.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      }, {})
    );
  };

  renderChart() {
    const data = this.state.wordFrequency
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    console.log(data);
    // Set the dimensions and margins
    const margin = { top: 10, right: 50, bottom:50, left: 50 },
      w = 1000 - margin.left - margin.right,
      h = 150 - margin.top - margin.bottom;
    
    // If statement to check if the data array isn't empty
    if(data.length>0){
      const wordScale = d3
      .scaleLinear() // Creates a linear scale for the words along x-axis
      .domain([0,4]) // Used for getting the top 5 words
      .range([margin.left,w]) // Maps the words to the chart's width


      d3.select(".svg_parent") // Select the svg container element with class ".svg_parent"
      .selectAll("text") // Used to target all the text elements inside the container
      .data(data,d=>d[0]) // Bind data using word as the key
      // Still need to understand using join better https://d3js.org/d3-selection/joining
      .join( // join(enter, update, exit) 
        enter => enter.append("text")
          .attr("x", (d,i)=>wordScale(i))
          .attr("y", (h+margin.top+margin.bottom)/2)
          .text(d=>d[0])
          .attr("font-size",0)
          .transition().duration(5000)
          .attr("font-size", d=>`${(9*d[1])}px`),
        update => update
          .transition().duration(5000)
          .attr("font-size", d=>`${(9*d[1])}px`)
          .attr("x",(d,i)=>wordScale(i)),
        exit => exit.remove()
      )
    }
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            type="text"
            id="input_field"
            style={{ height: 150, width: 1000 }}
          />
          <button
            type="submit"
            value="Generate Matrix"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              var input_data = document.getElementById("input_field").value;
              this.setState({
                wordFrequency: this.getWordFrequency(input_data),
              });
            }}
          >
            {" "}
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
