/* Improvement for next project 
1. Use the word dataset instead of data where appr
*/

document.addEventListener("DOMContentLoaded", () => {
  //Setting up the SVG for plotting
  const svg = d3.select("#svg-graph");

  //Importing the data
  const dataSourceURL =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  fetch(dataSourceURL)
    .then((response) => response.json())
    .then((json) => plotData(json.data, svg));

  //Formatting the data
  const formatData = (data) => {
    //Format the data with
    //1. Quarters
    //2. A split up date
    //3. Utilise array of sub-objects instead
    //Current format of data [[date, gdp], ...]
    /*New format of data 
    [{
    year: "1948",
    month: "01",
    day: "01",
    quarter: 1,
    gdp: 243.1
    }, ...]
    */
    return data.map((cell) => {
      const arrSplitDate = cell[0].split("-");
      const strYear = arrSplitDate[0];
      const strMonth = arrSplitDate[1];
      const strDay = arrSplitDate[2];
      const gdp = cell[1];
      switch (strMonth) {
        case "01":
          return {
            year: strYear,
            month: strMonth,
            day: strDay,
            quarter: 1,
            gdp: gdp,
          };
        case "04":
          return {
            year: strYear,
            month: strMonth,
            day: strDay,
            quarter: 2,
            gdp: gdp,
          };
        case "07":
          return {
            year: strYear,
            month: strMonth,
            day: strDay,
            quarter: 3,
            gdp: gdp,
          };
        case "10":
          return {
            year: strYear,
            month: strMonth,
            day: strDay,
            quarter: 4,
            gdp: gdp,
          };
        default:
          throw "The month value was not either 01, 04, 07 or 10 in the dates of the received dates";
      }
      return undefined;
    });
  };

  //Plotting the data
  const plotData = (data, svg) => {
    //Format the data
    const formattedData = formatData(data);
    //Getting our svg dimension
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    //Setting up our svg padding
    const padding = 35;
    //Set up our axes scale
    //x=Year
    const minYear = d3.min(formattedData, (d) => Number(d.year));
    const maxYear = d3.max(formattedData, (d) => Number(d.year)) + 0.75;
    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width]);
    //y=GDP
    const minGDP = 0;
    const maxGDP = d3.max(formattedData, (d) => d.gdp);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxGDP])
      .range([height - padding, 15]);
    //Plotting our axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
      .append("g")
      .attr("transform", `translate(${0}, ${height - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("transform", `translate(${padding}, ${0})`)
      .attr("id", "y-axis")
      .call(yAxis);
    //Creating our tool tip
    const tooltip = d3
      .select(".graph-container")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);
    //Creating our tooltip functions
    //mouseoverTooltip: (Show the tooltip)
    const mouseoverTooltip = (e) => {
      tooltip.transition().duration(150).style("opacity", 0.95);
      d3.select(e.srcElement).style("fill", "#8FA38F");
    };
    //mouseleaveTooltip: (Hide the tooltip)
    const mouseleaveTooltip = (e) => {
      tooltip.transition().duration(150).style("opacity", 0);
      d3.select(e.srcElement).style("fill", "#4C5C4C");
    };
    //mousemoveTooltip: (Process the change in label)
    const mousemoveTooltip = (e) => {
      const data = d3.select(e.srcElement).data()[0];
      tooltip.attr("data-date", `${data.year}-${data.month}-${data.day}`);
      tooltip.selectAll("p").remove();
      tooltip.append("p").text(`${data.year}`);
      tooltip.append("p").text(`Q${data.quarter}`);
      tooltip.append("p").text(`$${data.gdp} billion`);
      tooltip
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY - 10 + "px");
    };

    //Actually plotting the data
    svg
      .selectAll("rect")
      .data(formattedData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        switch (d.quarter) {
          case 1:
            return xScale(Number(d.year));
            break;
          case 2:
            return xScale(Number(d.year) + 0.25);
            break;
          case 3:
            return xScale(Number(d.year) + 0.5);
            break;
          case 4:
            return xScale(Number(d.year) + 0.75);
            break;
          default:
            throw "f:plotData got a d.quarter not between 1-4";
        }
      })
      .attr("y", (d, i) => yScale(d.gdp))
      .attr("width", (d, i) => (xScale(1950) - xScale(1949.75)) * 0.9)
      .attr("height", (d, i) => height - padding - yScale(d.gdp))
      .attr("class", "bar")
      .attr("data-date", (d) => `${d.year}-${d.month}-${d.day}`)
      .attr("data-gdp", (d) => d.gdp)
      .on("mouseover", mouseoverTooltip)
      .on("mouseleave", mouseleaveTooltip)
      .on("mousemove", mousemoveTooltip);
  };
});
