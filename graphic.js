// Global variables
let dataset, labels, color_domain_max

const margin = {left: 0, top: 100, bottom: 0, right: 0}

// Height and width of browser
const height =  window.innerHeight
const width = window.innerWidth

const svg_height = height
const svg_width = svg_height*0.85

// Define the SVG
let svg = d3.select("svg")
    .attr('width',svg_width)
    .attr('height',svg_height)

// Projection and path
let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);

// Read in data
d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
    d3.json("GeoJSON/labeled.geojson").then(function(l){
        dataset = d;
        labels = l;

    /* -------------------------------------------------------------------------- */
    /*                              DRAWING FUNCTIONS                             */
    /* -------------------------------------------------------------------------- */
    // Function to draw points 
    function draw_points(){
        projection.fitSize([svg_width, svg_height],dataset);
        svg.selectAll("circle")
            .data(labels.features)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return projection(d.geometry.coordinates)[0] })
            .attr("cy", function(d) { return projection(d.geometry.coordinates)[1] })
            .attr("r", 4)
            .attr("stroke","white")
            .attr("stroke-width",0.5)
            .attr("fill","transparent")
            .transition()
            .duration(5000)
        };
     
    //  Function to draw DC map   
    function draw_map(){
        svg.selectAll("path")
            .data(dataset.features)
            .enter()
            .append("path")
            .attr("d", path).lower()
            .style("stroke", "white")
            .style("fill", "transparent") 
            .transition()
            .duration(3000)  
    };

    /* -------------------------------------------------------------------------- */
    /*                             COLORING FUNCTIONS                             */
    /* -------------------------------------------------------------------------- */
    
    // labeled.geojson was preprocessed to contain column domain_max with list of max label for each iteration
    let color_domain_max = labels.features[0]['properties'].domain_max;
    console.log("This is the max label for each example:", color_domain_max);

    // Since some examples have many labels, I'm going to combine 2 color palletes
    var color_scheme1 = d3.schemeTableau10;
    var color_scheme2 = d3.schemeAccent;
    var colors = color_scheme1.concat(color_scheme2);
    
    // Function to update the color range depending on how many labels (clusters) we got
    function get_color_domain(index){
        let color =  d3.scaleOrdinal()
                        .domain([0,color_domain_max[index]])
                        .range(colors);
        return color
    };

    // Function to color the points
    function color_points(index){
        color = get_color_domain(index);
        svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .style("fill", function(d) {
            if (d.properties.labels[index] !=-1) {
                return color(d.properties.labels[index]);
            } else {
                return "transparent"
            }
         })
        .style("stroke", function(d) {
            if (d.properties.labels[index] ==-1) {
                return "white";
            }
         })
    };

    // Functions to update colors for every iteration
    function color_points0(){
        color_points(0)
    };

    function color_points1(){
        color_points(1)
    };

    function color_points2(){
        color_points(2)
    };

    function color_points3(){
        color_points(3)
    };

    function color_points4(){
        color_points(4)
    };

    function color_points5(){
        color_points(5)
    };

    //  Function to color DC map   
    function color_map(){
        svg.selectAll("path")
            .style("fill", "#121619") 
            .transition()
            .duration(3000)  
    };
    /* -------------------------------------------------------------------------- */
    // Functions to clean up the SVG
        
    // Function to clear points
    function clean_points(){
        svg.selectAll('circle')
        .transition()
        .duration(2000)
        .remove();
    };

    // Function to clear map
    function clean_map(){
        svg.selectAll('path')
        .transition()
        .duration(2000)
        .remove();
    };

    /* -------------------------------------------------------------------------- */
    /*                                  SCROLLING                                 */
    /* -------------------------------------------------------------------------- */
    // Waypoints scroll constructor
    function scroll(n, offset, func1, func2){
        return new Waypoint({
        element: document.getElementById(n),
        handler: function(direction) {
            direction == 'down' ? func1() : func2();
            direction == 'up' ? func2() : func1();
        },
        //start 75% from the top of the div
        offset: offset
        });
    };

    // Scroll steps
    new scroll('welcome',"50%", draw_points, clean_points);
    new scroll('test',"50%", color_points0, draw_points);
    new scroll('test1',"50%", draw_map, color_points0);
    new scroll('test2',"50%", color_map, draw_map);
    new scroll('test3',"50%", color_points1, color_points0);
    new scroll('test4',"50%", color_points2, color_points1);
    new scroll('test5',"50%", color_points3, color_points2);
    new scroll('test6',"50%", color_points4, color_points3);
    new scroll('test7',"50%", color_points5, color_points4);



    // new scroll('test1',"50%", color_points1, color_points0);
    // new scroll('test2',"50%", color_points2, color_points1);
    // new scroll('test3',"50%", color_points3, color_points2);
    // new scroll('test4',"50%", color_points4, color_points3);
    // new scroll('test5',"50%", color_points5, color_points4);


})});

