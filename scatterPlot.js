function scatterPlotHandler() {

	var t = this;

	dataChanged();
	Model.addDataChangeListener(dataChanged);

	function dataChanged() {
		var div = document.getElementById("scatterCont");
		while (div.firstChild) {
			div.removeChild(div.firstChild);
		}
		sp = new scatterPlot(Model.constituenciesArray, t);

	}

}

function scatterPlot(dataset, parent){

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

	var xMin, yMin, xMax, yMax;

            //Width and height
			var w = 500;
			var h = 300;
			var padding = 30;
			
			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d.x; })])
								 .range([padding, w - padding * 2]);

			var yScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d.y; })])
								 .range([h - padding, padding]);

			var rScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d.y; })])
								 .range([2, 5]);

			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(5);

			//Define Y axis
			var yAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("left")
							  .ticks(5);

			//Create SVG element
			var svg = d3.select("#scatterCont")
						.append("svg")
						.attr("width", "100%")
						.attr("height", "100%")
						.attr("viewBox", "-50 0 "+(w+25)+" "+h);

			//Create circles
			svg.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .on("mouseover", mouseOver)
			   .on("mouseout", mouseOut)
			   .on("click", clickElem)
			   .attr("cx", function(d) {
			   		return xScale(d.x);
			   })
			   .attr("cy", function(d) {
			   		return yScale(d.y);
			   })
			   .attr("r", function(d) {
			   		return rScale(d.y);
			   });
			
			//Create X axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Create Y axis
			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);

			svg.call(tip);

			onDataChange();
			bakeColours();

			Model.addChangeListener(bakeColours);

	function getVarName(vari) {
		var col1 = parseInt(vari.replace(/\D/g,''));
		if(vari.charAt(0) == "r"){
			return Model.data.referendum[0][col1]
		} else {
			return Model.data.simd[0][col1]
		}
	}

	function onDataChange() {
		var dat = Model.constituenciesArray;
		xMax = -Infinity;
		xMin = Infinity;
		yMax = -Infinity;
		yMin = Infinity;
		for (var i=0; i<dat.length; i++) {
			if (dat[i].x < xMin) xMin = dat[i].x;
			if (dat[i].x > xMax) xMax = dat[i].x;
			if (dat[i].y < yMin) yMin = dat[i].y;
			if (dat[i].y > yMax) yMax = dat[i].y;
		}
	}

	function mouseOver(d, i) {
		Model.hover(d.id);
		tip.attr('class', 'd3-tip show').show(d.name+"<br><span class='d3-subtip'>"+getVarName(Model.comparison.var1)+": "+d.x+"<br>"+getVarName(Model.comparison.var2)+": "+d.y+"</span>");
	}

	function mouseOut(d, i) {
		Model.unhover();
		tip.attr('class', 'd3-tip').hide();
	}

	function clickElem(d, i) {
		if (d.selected) Model.unselect(d.id);
		else Model.select(d.id);
	}

	function getCentroid(selection) {
		try {
			// get the DOM element from a D3 selection
			// you could also use "this" inside .each()
			var element = selection.node(),
				// use the native SVG interface to get the bounding box
				bbox = element.getBBox();
			// return the center of the bounding box
			return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
		} catch(e) {
			return [0,0];
		}
	}

	function bakeColours() {
		setMapAttrs(

		svg.selectAll("circle")
			.transition()
			.ease("elastic")

		);
	}

	function setMapAttrs(target) {
		target.style("fill", function(d) {
			if (!d.selected) return "#CCCCCC";
			if (d.hover) return "#FFBF00";
			var multiplyX = (d.x-xMin)/(xMax-xMin);
			var multiplyY = (d.y-yMin)/(yMax-yMin);
			return "hsl("+multiplyX*120+",100%,"+(25+(multiplyY*35))+"%)";
			//return "rgb("+(1-multiplyX)*128+", "+multiplyX*255+", "+255+")";
		})	
		.attr("transform", function(d) {
			var centroid = getCentroid(d3.select(this)),
			x = centroid[0],
			y = centroid[1];
			return "translate(" + x + "," + y + ")"
			+ "scale(" + ((d.selected)?((d.hover)?3:1.0):0) + ")"
			+ "translate(" + -x + "," + -y + ")";
		})
		.attr("cx", function(d) {
			return xScale(d.x);
		})
		.attr("cy", function(d) {
			return yScale(d.y);
		})
		.attr("r", function(d) {
			return rScale(d.y);
		});;
	}

}
