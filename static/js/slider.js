var old_left = 1;
var old_right = 12;

var new_left = 0;
var new_right = 0;

function d3_Slider(){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var margin = {top: 0, right: 0, bottom: 0, left: 0}
    width = 1590 - margin.left - margin.right;
    height = 50 - margin.top - margin.bottom; 

    // The number of datapoints
    var n = 12;

    // 5. X scale will use the index of our data
    var xScale = d3.scalePoint()
        .domain(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']) // input
        .range([0, width]); // output

    // 1. Add the SVG to the page and employ #2
    d3.select("#svg-holder-slider").select("svg").remove();
    var svg = d3.select("#svg-holder-slider").append("svg")
        .attr("width", width +110 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("border","none")
        .style("margin-left","-45px")
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "axis-titles")
        .attr("fill","white")
        .style("font-size","14px")
        .attr("transform", "translate(40,0)")
        .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom
}

function test_func(){
    new_left = document.getElementById("range-1a").value;
    new_right = document.getElementById("range-1b").value;
    
    if(old_left != new_left || old_right != new_right){
        //  trigger some function call
        var data;
        if (new_left==1 && new_right==12){
            data = "reset";
        }
        else{
            data = new_left + "," + new_right;
        }
        
        drawGraphs(data);
        old_left = new_left
        old_right = new_right
    }
    
}

window.setInterval(function(){
    test_func()
  }, 300);