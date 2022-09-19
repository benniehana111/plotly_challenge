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

    });
  }

  // 1. Create the buildCharts function.
  function buildCharts(sample) {

    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);

    // 3. Create a variable that holds the samples array. 
    var sample_data = data.samples;
    console.log(sample_data);
  
    // 4. Create a variable that filters sample data for the sample id chosen 
    //    from the dropdown and passed into the buildCharts()function.
    var sample_id = sample_data.filter(sampleObj => sampleObj.id == sample);
    console.log(sample_id);

    //  5. Create a variable that holds the first sample in the array.
    var first_sample = sample_id[0];
    console.log(first_sample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_otu_ids = first_sample.otu_ids;
    var sample_otu_labels = first_sample.otu_labels;
    var sample_values = first_sample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var ranked_samples = sample_values.sort((a,b) => b - a);
    var top10_samples = ranked_samples.slice(0,10);
    console.log(top10_samples);

    var yticks = top10_samples

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10_samples.map(values => values),
      y: sample_otu_ids.map(ids => "OTU " + ids),
      text: sample_otu_labels.map(labels => labels),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"};

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//Deliverable 2

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sample_otu_ids.map(ids => ids),
      y: sample_values.map(values => values),
      text: sample_otu_labels.map(labels => labels),
      mode : "markers",
      marker : {
        size: sample_values.map(values => values),
        color : sample_otu_ids.map(ids => ids)
  }
  }
    ];
      
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title : "OTU ID"
      }
    };
      
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
 
  });
} 