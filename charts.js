function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    console.log(sampleNames)
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log(sampleNames)
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray)
    var result = resultArray[0];
    console.log(result)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSampleNumber = samplesArray.filter(sampArr => sampArr.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = desiredSampleNumber[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var newOtu_ids = result.otu_ids;
    var newOtu_labels = result.otu_labels;
    var newSample_value = result.sample_values;
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
 

    var yticks = newOtu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse()
  
    yticks = yticks.sort((a, b) => a - b);
  
    // 8. Create the trace for the bar chart. 
    var barData = {

      x: newSample_value.slice(0, 10).reverse(),
      y: yticks,
      text: newOtu_ids.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      barmode: 'stack',
      yaxis: {
        tickmode: "linear",
      
      },
      plot_bgcolor: "#FFF3",
      paper_bgcolor:"#FFF3"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", [barData], barLayout);

    //Deliverable 2
    // Use Plotly to plot the data with the layout. 

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: newOtu_ids,
      y: newSample_value,
      text: newOtu_labels,
      mode: 'markers',
      marker: {
        size: newSample_value,
        color: newOtu_ids,
  
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },

      hovermode: true,
      plot_bgcolor:"#FFF3",
      paper_bgcolor:"#FFF3" 
    };

    // 3. Use Plotly to plot the data with the layout.

    Plotly.newPlot("bubble-plot", [bubbleData], bubbleLayout);

    // Deliverable 3

    // 3. Create a variable that holds the washing frequency.
    var desiredFrequency = data.metadata.filter(sampArr => sampArr.id == sample);
    var wfreq = desiredFrequency.map(d => d.wfreq)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseInt(wfreq),
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickcolor: 'darkblue' },
          bar: { color: 'black'},
          steps: [
            { range: [0, 2], color: "powderblue" },
            { range: [2, 4], color: "deepskyblue" },
            { range: [4, 6], color: "blue" },
            { range: [6, 8], color: "darkblue" },
            { range: [8, 10], color: "darkslateblue" }
          ]

        }
      }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400, height: 400, margin: { t: 0, b: 0 },
      plot_bgcolor: "teal",
      paper_bgcolor:"#FFF3"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  })
};