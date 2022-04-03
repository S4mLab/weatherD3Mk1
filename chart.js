import * as d3 from 'd3';

const weatherUrl =
  'https://gist.githubusercontent.com/S4mLab/443e4c9ec734ce19b202c54b0666e7fe/raw/6d14a1d3778b39d3b3b5e9509ecb17cee738bc9a/weather_data.json';

// dimension of the wrapper
const wrapperDimensions = {
  width: window.innerWidth * 0.9,
  height: 400,
  margins: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
};

// dimension of the graph
const graphDimension = {
  width:
    wrapperDimensions.width -
    wrapperDimensions.margins.left -
    wrapperDimensions.margins.right,
  height:
    wrapperDimensions.height -
    wrapperDimensions.margins.top -
    wrapperDimensions.margins.bottom,
};

async function drawLineGraph() {
  let weatherObjsList;

  // loading data
  try {
    weatherObjsList = await d3.json(weatherUrl);
    console.log(weatherObjsList);
  } catch (err) {
    console.error(err);
  }

  // Data accessors and processors
  const yAccessor = (dataObj) => dataObj.temperatureMax;
  const dateParser = d3.timeParse('%Y-%m-%d');
  const xAccessor = (dataObj) => dateParser(dataObj.date);

  // initiate the wrapper around the graph
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', wrapperDimensions.width)
    .attr('height', wrapperDimensions.height)
    .style('border', '1px solid');

  // initiate the graph that display the data
  const graph = wrapper.append('g').style(
    'transform',
    `translate(
      ${wrapperDimensions.margins.left}px,
      ${wrapperDimensions.margins.top}px
    )`
  );

  const tempDomain = d3.extent(weatherObjsList, yAccessor);
  // convert temp value into pixel value in the y axis
  const yScale = d3
    .scaleLinear()
    .domain(tempDomain)
    .range([graphDimension.height, 0]);

  const timeDomain = d3.extent(weatherObjsList, xAccessor);
  const xScale = d3
    .scaleTime()
    .domain(timeDomain)
    .range([wrapperDimensions.margins.left, graphDimension.width]);

  const freezingTempScale = yScale(32);
  const freezingTempArea = graph
    .append('rect')
    .attr('x', 0)
    .attr('width', graphDimension.width)
    .attr('y', freezingTempScale)
    .attr('height', graphDimension.height - freezingTempScale)
    .attr('fill', '#e0f3f3');

  // extract x,y value for d attr of path svg element
  const lineGenerator = d3
    .line()
    .x((dataObj) => xScale(xAccessor(dataObj)))
    .y((dataObj) => yScale(yAccessor(dataObj)));

  const drawLine = graph
    .append('path')
    .attr('d', lineGenerator(weatherObjsList))
    .attr('fill', 'none')
    .attr('stroke', '#af9358')
    .attr('stroke-width', 2);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const xAxisGenerator = d3.axisBottom().scale(xScale);

  // generate the y axis
  const yAxis = graph.append('g').call(yAxisGenerator);
  // generate the x axis
  const xAxis = graph
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${graphDimension.height}px)`);
}

drawLineGraph();
