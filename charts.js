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

      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });}

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
      var result = resultArray[0];
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
    });}

  // 1. Create the buildCharts function.
  function buildCharts(sample) {

    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var sample_data = data.samples;
  
    // 4. Create a variable that filters sample data for the sample id chosen 
    //    from the dropdown and passed into the buildCharts()function.
    var sample_id = sample_data.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var first_sample = sample_id[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var list_otu_ids = first_sample.otu_ids;
    var list_otu_labels = first_sample.otu_labels;
    var list_values = first_sample.sample_values;
    console.log(list_otu_ids);
    console.log(list_otu_labels);
    console.log(list_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //       so the otu_ids with the most bacteria are last. 
    var top10_values = list_values.slice(0,10);
    console.log(top10_values);

    var yticks = top10_values

    // 8. Create the trace for the bar chart. 
    var trace = [{
      x: top10_values.map(values => values),
      y: list_otu_ids.map(ids => "OTU " + ids),
      text: list_otu_labels.map(labels => labels),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures Found"};
      
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, layout);

//Deliverable 2

    // 1. Create the trace for the bubble chart.
    var bubbletrace = [{
      x: list_otu_ids.map(ids => ids),
      y: list_values.map(values => values),
      text: list_otu_labels.map(labels => labels),
      mode: "markers",
      marker: {
        size: list_values.map(values => values/1.25),
        color: list_otu_ids.map(ids => ids)
  }}];
      
    // 2. Create the layout for the bubble chart.
    var bubblelayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: {title : "OTU ID"}
    };
      
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbletrace,bubblelayout); 

//Deliverable 3
  
    // 1. Create a variable that filters the metadata array for 
    //    the selected Test Subject ID No.
    var metadataObj = data.metadata;
  
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataArray = metadataObj.filter(sampleObj => sampleObj.id == sample);
    var firstMetadata = metadataArray[0];
  
    // 3. Create a variable that holds the washing frequency.
    var washfreq = firstMetadata.wfreq;
  
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreq,
        title: { text: "<B>Belly Button Washing Frequency<br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",            
        gauge: {
        axis: { range: [0, 10] },            
        bar : { color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }
    ]}}];
          
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450, 
      height: 350,          
      margin: { t: 50, r: 50, l: 50, b: 50 },
      font: { color: "black", family: "Calibri" }
    };
      
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);      
          
  });
} 