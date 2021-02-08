var dc_superheros
var marvel_superheros;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  //year=document.getElementById("year-input").value;
  div = d3.select("body").append("div")
  tooltip=d3.select("body").append("div")
  .attr("class","tooltip")
  .style("opacity",0);
  svg = d3.select('#map');
  svg.append('g').attr("id","plots")
  tooltip=d3.select("body").append("div")
  .attr("class","tooltip")
  .style("opacity",0);

  // Load both files before doing anything else
  Promise.all([d3.csv('data/dc-superheroes_geocodio.csv'),d3.csv('data/marvel-superheroes_geocodio.csv')])
  .then(function(values){

dc_superheros = values[0];
marvel_superheros = values[1];

drawMap1();
drawMap2();

})

});

function drawMap1()
{
// console.log(dc_superheros);
// console.log(marvel_superheros);
var margin = {top: 40, right: 20, bottom: 50, left: 60},
    width = 900 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;


// setup fill color
var cValue = function(d) {return d.Universe;},
    color = d3.scaleOrdinal()
    .range(d3.schemeCategory10);


// add the graph canvas to the body of the webpage
var svg = d3.select("#map1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("/data/final_data.csv").then(function(data){

  // change string (from CSV) into number format
  var array = [];
  data.forEach(function(d) {
    if(parseInt(d.Weight) > 0){
    
    temp = {
      'Weight' : +d.Weight,
      'Strength' : +d["Strength"],
      'Gender' : d.Gender,
      'Universe': d.Universe,
      'HeroName':d.HeroName
    }
    
  array.push(temp);
  }

    // d.Weight = +d.Weight;
    // d["Strength"] = +d["Strength"];
    }
  );

  var shape = d3.scaleOrdinal(data.map(d => d.Gender), d3.symbols.map(s => d3.symbol().type(s)()))

  var div = d3.select("body").append("div")
  .attr("class", "tooltip-donut")
  .style("opacity", 0);
		//scale function
		var xScale = d3.scaleLinear()
      .domain([0,2000])
			.range([0, width]);
			
		var yScale = d3.scaleLinear()
			.domain([0, d3.max(array, function(d) { console.log(d["Strength"]);return d["Strength"]; })])
			.range([height, 0]);
		
		var xAxis = d3.axisBottom().scale(xScale);
		
		var yAxis = d3.axisLeft().scale(yScale);
  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Weight");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Strength");

  // draw dots
  svg.selectAll(".dot")
  .data(array)
  .enter().append("path")
  .attr("class", "point")
  .attr("r",100).attr("d", d3.symbol().type(function(d)
  {
    if((d.Gender=="male") && (d.Weight>0))
    {
      return d3.symbolStar;
    }

    else
    {
      return d3.symbolDiamond;
    }
  
  }
  ))
  .attr("transform", function(d) { return "translate(" + xScale(d.Weight) + "," + yScale(d.Strength) + ")"; })
  .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(e,d) {
        
        div.transition().duration(50).style("opacity", 0.8);

    div.html(d.HeroName+ " - "+d.Universe +"<br />Weight: " + d.Weight + "<br /> Strength: " + d.Strength + "</b>")
      .style("left", (e.pageX) + 15 + "px")
      .style("top", (e.pageY) - 45 + "px");
      })
      .on("mouseout", function(e,d) {
        div.transition().duration('50').style("opacity", 0);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18+20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24+20)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});

// text label for the x
svg.append("text")
        .attr("x", (width / 2-10))             
        .attr("y", 730)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("stroke","rgb(106, 61, 154") 
        .text('Weight');

// text label for the y
svg.append("text")
.attr("transform", "rotate(-90)")
//.attr("id", "y-label")
.attr("y", -50)
.attr("x",-300 )
.attr("dy", "1em")
.style("text-anchor", "middle")
.style("stroke","rgb(106, 61, 154")
.text("Strength");


svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 170)
                        .attr("x2", 830)
                        .attr("y2", 170)
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("stroke", "black");




svg.append("line")
                        .attr("x1", 200)
                        .attr("y1", 000)
                        .attr("x2", 200)
                        .attr("y2", 710)
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("stroke", "black");



                        var svg1 = d3.select("#map3")
                        .attr("width", "600px")
                           .attr("height", "200px")
                         .append("g")
                           .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                           ;
                           svg1.append("text")
                           .attr("font-family","Lucida Console")
                           .attr("font-size","20px")
                           .attr("fill","black")
                           .attr("x","-50")
                           .attr("y","0")
                           .text("When selecting Weight and Strength as key attributes to compare the")
                          
                        svg1.append("text")
                        .attr("font-family","Lucida Console")
                        .attr("font-size","20px")
                        .attr("fill","black")
                        .attr("x","-50")
                        .attr("y","25")
                        .text("superheros with the baseline for Weight being set at 500 lbs and the")
                       
                        svg1.append("text")
                        .attr("font-family","Lucida Console")
                        .attr("font-size","20px")
                        .attr("fill","black")
                        .attr("x","-50")
                        .attr("y","50")
                        .text("baseline for Strength being set at 75, there seems to be equal number of ")
                       
                       
                        svg1.append("text")
                        .attr("font-family","Lucida Console")
                        .attr("font-size","20px")
                        .attr("fill","black")
                        .attr("x","-50")
                        .attr("y","75")
                        .text("super heros in that region, however there seems to be more number of ")
                       
                        svg1.append("text")
                        .attr("font-family","Lucida Console")
                        .attr("font-size","20px")
                        .attr("fill","black")
                        .attr("x","-50")
                        .attr("y","100")
                        .text("female superheors from DC universe when compared to Marvel. There seems to")

                        svg1.append("text")
                        .attr("font-family","Lucida Console")
                        .attr("font-size","20px")
                        .attr("fill","black")
                        .attr("x","-50")
                        .attr("y","125")
                        .text("more Marvel male superheros who are heavier as well as have high strength.")
                       
// draw legend text
svg.append("text")
.attr("x", width - 24+20)
.attr("y", 49)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text("Male")
svg.append("text")
.attr("x", width - 24+40)
.attr("y", 49)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text("★")

// draw legend text
svg.append("text")
.attr("x", width - 24+30)
.attr("y", 69)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text("Female")
svg.append("text")
.attr("x", width - 24+40)
.attr("y", 69)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text("♦")
}



function drawMap2()
{
// console.log(dc_superheros);
// console.log(marvel_superheros);
var margin = {top: 40, right: 20, bottom: 50, left: 60},
    width = 900 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;


// setup fill color
var cValue = function(d) {return d.Universe;},
    color = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

// add the graph canvas to the body of the webpage
var svg = d3.select("#map2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("/data/final_data.csv").then(function(data){

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Speed = +d.Speed;
    d["Intelligence"] = +d["Intelligence"];

  });

 
  var div = d3.select("body").append("div")
  .attr("class", "tooltip-donut")
  .style("opacity", 0);
		//scale function
		var xScale = d3.scaleLinear()
      .domain([0,d3.max(data, function(d) { return d["Speed"]; })])
			.range([0, width]);
			
		var yScale = d3.scaleLinear()
			.domain([0, d3.max(data, function(d) { console.log(d["Intelligence"]);return d["Intelligence"]; })])
			.range([height, 0]);
		
		var xAxis = d3.axisBottom().scale(xScale);
		
		var yAxis = d3.axisLeft().scale(yScale);
  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Weight");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Strength");

  // draw dots
  svg.selectAll(".dot")
  .data(data)
  .enter().append("path")
  .attr("class", "point")
  .attr("d", d3.symbol().type(function(d)
  {
    if(d.Gender=="male")
    {
      return d3.symbolStar;
    }
    else{
      return d3.symbolDiamond;
    }
  }))
  .attr("transform", function(d) { return "translate(" + xScale(d.Speed) + "," + yScale(d.Intelligence) + ")"; })
  .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(e,d) {
        
        div.transition().duration(50).style("opacity", 0.8);

    div.html(d.HeroName+ " - "+d.Universe +"<br />Speed: " + d.Speed + "<br /> Intelligence: " + d.Intelligence + "</b>")
      .style("left", (e.pageX) + 15 + "px")
      .style("top", (e.pageY) - 45 + "px");
      })
      .on("mouseout", function(e,d) {
        div.transition().duration('50').style("opacity", 0);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
 

  // draw legend text
  svg.append("text")
      .attr("x", width - 24)
      .attr("y", 49)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Male")
      svg.append("text")
      .attr("x", width - 24+20)
      .attr("y", 49)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("★")

      // draw legend text
  svg.append("text")
  .attr("x", width - 24)
  .attr("y", 69)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text("Female")
  svg.append("text")
  .attr("x", width - 24+20)
  .attr("y", 69)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text("♦")

      


});



// text label for the x
svg.append("text")
        .attr("x", (width / 2-10))             
        .attr("y", 730)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("stroke","rgb(106, 61, 154") 
        .text('Speed');

// text label for the y
svg.append("text")
.attr("transform", "rotate(-90)")
//.attr("id", "y-label")
.attr("y", -50)
.attr("x",-300 )
.attr("dy", "1em")
.style("text-anchor", "middle")
.style("stroke","rgb(106, 61, 154")
.text("Intelligence");



svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 245)
                        .attr("x2", 830)
                        .attr("y2", 245)
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("stroke", "black");




svg.append("line")
                        .attr("x1", 492)
                        .attr("y1", 000)
                        .attr("x2", 492)
                        .attr("y2", 710)
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("stroke", "black");
  
 var svg1 = d3.select("#map4")
 .attr("width", "600px")
    .attr("height", "200px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;
    svg1.append("text")
    .attr("font-family","Lucida Console")
    .attr("font-size","20px")
    .attr("fill","black")
    .attr("x","-50")
    .attr("y","0")
    .text("When we consider Intelligence and Speed to see which set of superheros are")
   
 svg1.append("text")
 .attr("font-family","Lucida Console")
 .attr("font-size","20px")
 .attr("fill","black")
 .attr("x","-50")
 .attr("y","25")
 .text("superior, there seems to be more Marvel superheros who are Intelligent")

 svg1.append("text")
 .attr("font-family","Lucida Console")
 .attr("font-size","20px")
 .attr("fill","black")
 .attr("x","-50")
 .attr("y","50")
 .text("as well as seem to have higher pace. The baseline for the speed was set ")


 svg1.append("text")
 .attr("font-family","Lucida Console")
 .attr("font-size","20px")
 .attr("fill","black")
 .attr("x","-50")
 .attr("y","75")
 .text("at 60, while the baseline for the Intelligence was set at 75. Marvel ")

 svg1.append("text")
 .attr("font-family","Lucida Console")
 .attr("font-size","20px")
 .attr("fill","black")
 .attr("x","-50")
 .attr("y","100")
 .text("seems to have more female superheros in that region when compared to DC.")

 
                      
}

