/* ----------------------------------------------------------------------------
File: Scatterplot.js
Contructs a scatterpolot showing total energy consumption in several countries 
around the world.
Julia Sharp
-----------------------------------------------------------------------------*/ 
    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scale.category20();

    //Define Scales   
    var xScale = d3.scale.linear()
        .range([0, width]);
    var yScale = d3.scale.linear()
        .range([height, 0]);
    
    //Define Tooltip 
    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);
      
    //Define Axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);
    
    //Get data from csv file
    d3.csv("scatterdata.csv",function(error, data){
    data.forEach(function(d) {
        d.gdp = + d.gdp
        d.epc = +d.epc;
    });
    //Define x and y scale
    xScale.domain(d3.extent(data, function(d) { return d.gdp; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d.epc; })).nice();

    //Scale Changes as we Zoom
    var zoom = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .scaleExtent([1, 32])
    .on("zoom", zoomed);
    
    //Define SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
   
        //Draw Scatterplot
        svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d.total)/.2; })
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function (d) { return colors(d.country); })
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9)      
            div .html(d.country + "<br/>" 
             + "Population: " + d.population + "<br/>" 
             + "GDP: " + d.gdp + "<br/>" 
             + "EPC: " + d.epc + "<br/>" 
             + "Total: " +  d.total
             )  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

    //Draw Country Names
        svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });

    //append x-axis and label axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010");

    
    //append Y-axis and label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");

    
     // draw legend colored rectangles
    svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    //Draw circle in legend
    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");

    //Draw circle in legend
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    //Draw circle in legend
    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    //Label circle
    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    //Label circle
    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    //Label circle
    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");

    //Label legend
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");

    //Call reset button
    d3.select("button").on("click", reset);

    //binds circles and their title when user zooms and pans
    function zoomed() {
        svg.select(".x.axis").call(xAxis)
        svg.select(".y.axis").call(yAxis)

        svg.selectAll(".dot")
        .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
        svg.selectAll(".text")
        .attr("transform", "translate(" + d3.event.translate + ")scale("+ d3.event.scale + ")");
        //.attr("transform", transform);
    }

    //Recenters screen when reset button is clicked
    function reCenter(){
        svg.select(".x.axis").call(xAxis)
        svg.select(".y.axis").call(yAxis)
    }

    //Function gets called when "reset" is clicked. Redefines min and max and binds to axis.
  function reset() {
  d3.transition().duration(750).tween("zoom", function() {
    var ix = d3.interpolate(xScale.domain(), d3.extent(data, function(d) { return d.gdp; })),
        iy = d3.interpolate(yScale.domain(), d3.extent(data, function(d) { return d.epc; }));
    return function(t) {
      zoom.x(xScale.domain(ix(t))).y(yScale.domain(iy(t)));
      reCenter();
    };
  });
}     
});


