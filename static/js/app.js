//load the data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) 
{
//populate the dropdown list with subjects' ID values
let select = document.getElementById("selDataset");
for(let i = 0; i < data.names.length; i++) {
    select.options[i] = new Option(data.names[i],i);
};
//function for creating the plots for the first subject (ID 940)
function init() {
    //data for the bar graph
    var d = [{
        type: "bar",
        x: data.samples[0].sample_values.slice(0,10),
        y: data.samples[0].otu_ids.slice(0,10),
        text: data.samples[0].otu_labels.slice(0,10),
        orientation: "h"
    }];
    //layout for the first graph
    var layout1 = {
        yaxis: {
            type: "category",
            title: "OTU"
        },
        xaxis: {
            title: "Sample Value"
        }
    }
    //make the first plot
    Plotly.newPlot("bar",d,layout1)

    //make the colors for the bubble plot, scaling them based on the OTU ID
    let colors = []
    let maximum = data.samples[0].otu_ids.reduce((a,b) => Math.max(a,b),-Infinity);
    for(let i = 0; i < data.samples[0].otu_ids.length; i++) {
        colors.push(`hsl(${Math.floor(330 * data.samples[0].otu_ids[i]/maximum)},100,50)`)
    }
    //data for the bubble plot
    var d1 = [{
        mode: "markers",
        x: data.samples[0].otu_ids,
        y: data.samples[0].sample_values,
        marker: {
            color: colors,
            size: data.samples[0].sample_values
        },
        text: data.samples[0].otu_labels
    }]
    //layout for the bubble graph
    let layout2 = {
        xaxis: {
            title: "OTU ID"
        },
        yaxis: {
            title: "Sample Value"
        }
    }
    //make the bubble plot
    Plotly.newPlot("bubble",d1,layout2)
}
//fill in the metadata about the subject
let id = d3.select("#sample-metadata").append("p").text(`id:  ${data.metadata[0].id}`);
let ethnicity = d3.select("#sample-metadata").append("p").text(`ethnicity:  ${data.metadata[0].ethnicity}`);
let gender = d3.select("#sample-metadata").append("p").text(`gender:  ${data.metadata[0].gender}`);
let age = d3.select("#sample-metadata").append("p").text(`age:  ${data.metadata[0].age}`);
let location = d3.select("#sample-metadata").append("p").text(`location:  ${data.metadata[0].location}`);
let bbtype = d3.select("#sample-metadata").append("p").text(`bbtype:  ${data.metadata[0].bbtype}`);
let wfreq = d3.select("#sample-metadata").append("p").text(`wfreq:  ${data.metadata[0].wfreq}`);

//do the updateSubject function when a new subject is selected
d3.selectAll("#selDataset").on("change", updateSubject);
//function for when a new subject is selected
function updateSubject(){
    //select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  //get the index of the selected subject
  let dataset = dropdownMenu.property("value");
  //set up the data for the selected index
  let x1 = data.samples[dataset].sample_values.slice(0,10);
  let y1 = data.samples[dataset].otu_ids.slice(0,10);
  let hover1 = data.samples[dataset].otu_labels.slice(0,10);
  //restyle the bar graph with new data
  Plotly.restyle("bar", "x", [x1]);
  Plotly.restyle("bar", "y", [y1]);
  Plotly.restyle("bar","text",[hover1]);
  //make sure it still treats the y-axis as category names
  let update = {
    'yaxis.type': "category"
  };
  Plotly.relayout("bar",update);

  //select the new data for the bubble
  let x2 = data.samples[dataset].otu_ids;
  let y2 = data.samples[dataset].sample_values;
  let hover2 = data.samples[dataset].otu_labels;
  //scale the colors for the new OTU IDs
  let colors = [];
  let maximum = data.samples[dataset].otu_ids.reduce((a,b) => Math.max(a,b),-Infinity);
  for(let i = 0; i < data.samples[dataset].otu_ids.length; i++) {
      colors.push(`hsl(${Math.floor(330 * data.samples[dataset].otu_ids[i]/maximum)},100,50)`)
  }
  //restyle the plot with the new data
  Plotly.restyle("bubble","x",[x2]);
  Plotly.restyle("bubble","y",[y2]);
  Plotly.restyle("bubble","marker.size",[y2]);
  Plotly.restyle("bubble","text",[hover2]);
  Plotly.restyle("bubble","marker.color",[colors])

  //update the metadata about the selected subject
  id.text(`id:  ${data.metadata[dataset].id}`)
  ethnicity.text(`ethnicity:  ${data.metadata[dataset].ethnicity}`)
  gender.text(`gender:  ${data.metadata[dataset].gender}`)
  age.text(`age:  ${data.metadata[dataset].age}`)
  location.text(`location:  ${data.metadata[dataset].location}`)
  bbtype.text(`bbtype:  ${data.metadata[dataset].bbtype}`)
  wfreq.text(`wfreq:  ${data.metadata[dataset].wfreq}`)
}
//run the function to make the initial plots
init()
});
