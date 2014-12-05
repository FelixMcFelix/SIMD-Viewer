function barChartHandler() {

	var t = this;
	var g;

	var data;

	initData();
	Model.addHoverListener(hover);
	Model.addUnhoverListener(hover);

	Model.addSelectListener(initData);
	Model.addUnselectListener(initData);
	Model.addDataChangeListener(dataChanged);

	function hover() {
		if (g != null) g.hover();
	}

	function resetHooks() {
		if (g != null) {
			g.resetHooks();
		}
	}

	setInterval(resetHooks, 16); //most reliable way of keeping our fancy tooltips

	function initData() {
		if (g != null) {
			Model.removeChangeListener(g.change);
			g.kill();
		}
		data = [
			{
				key: getVarName(Model.comparison.var1),
				values: []
			},

			{
				key: getVarName(Model.comparison.var2),
				values: []
			}
		]

		var dat = Model.constituenciesArray.slice(0);
		dat = sortConst(dat);
		var j = 0;
		for (var i=0; i<dat.length; i++) {
			if (dat[i].selected) {
				data[0].values[j] = {x: dat[i].name, y:dat[i].x, d:dat[i]};
				data[1].values[j++] = {x: dat[i].name, y:dat[i].y, d:dat[i]};
			}
		}

		var div = document.getElementById("barCont");
		while (div.firstChild) {
			div.removeChild(div.firstChild);
		}
		g = new drawGraph(data, t);
	}

	function dataChanged() {

		data[0].key = getVarName(Model.comparison.var1);
		data[1].key = getVarName(Model.comparison.var2);

		var dat = Model.constituenciesArray.slice(0);
		dat = sortConst(dat);
		var j = 0;
		for (var i=0; i<dat.length; i++) {
			if (dat[i].selected) {
				data[0].values[j].x = dat[i].name;
				data[1].values[j].x = dat[i].name;
				data[0].values[j].y = dat[i].x
				data[1].values[j++].y = dat[i].y
			}
		}
		t.sp.update();
	}

	function sortConst(dat) {
		return dat.sort(function(a, b){
			switch (Model.comparison.sortBy) {
				case 0:
					return a.name.localeCompare(b.name);
				case 1:
					return a.x-b.x;
				case 2:
					return a.y-b.y;
			}
		})
	}

	function getVarName(vari) {
		var col1 = parseInt(vari.replace(/\D/g,''));
		if(vari.charAt(0) == "r"){
			return Model.data.referendum[0][col1]
		} else {
			return Model.data.simd[0][col1]
		}
	}

}


function drawGraph(dataPoints, owner, tip) {
	this.resetHooks = resetHooks;
	this.kill = kill;
	this.hover = hover;	

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
	var xMin, xMax, yMin, yMax;
	var owner = owner;
	var chart, bars;

	Model.addChangeListener(bakeColours);
	this.change = bakeColours;
	onDataChange();

	nv.addGraph(function() {

    	chart = nv.models.multiBarChart();

		chart.xAxis

			.tickFormat(function(d, i){

				return d;

			});

		chart.yAxis

			.tickFormat(d3.format(',.s'));



		var svg = d3.select("#barCont")
			.append("svg")

		svg.datum(dataPoints)

			.transition().duration(500)

			.call(chart)

		svg.call(tip);

		bars = svg.selectAll(".nv-bar")
			.on("mouseover", mouseOver)
			.on("mouseout", mouseOut)
			.on("click", clickElem)


		nv.utils.windowResize(chart.update);
		owner.sp = chart;
		return chart;
	});

	function hover() {
		var newTip = false;
		bars
			.attr('class', function(d){
				if (d.d.hover && owner.visible) {
					tip.attr('class', 'd3-tip show').show(d.d.name+"<br><span class='d3-subtip'>"+getVarName(Model.comparison.var1)+": "+d.d.x+"<br>"+getVarName(Model.comparison.var2)+": "+d.d.y+"</span>", this).offset([-25, 0]);
					newTip = true;
				}
				return ((d.d.hover)?("nv-bar positive nv-bar-hov"):("nv-bar positive"));
			});
		if (!newTip) tip.attr('class', 'd3-tip hide').hide();
	}

	function resetHooks() {
		if(bars==null) return;
		bars.on("mouseover", mouseOver)
			.on("mouseout", mouseOut)
			.on("click", clickElem)
	}

	function kill() {
		tip.attr('class', 'd3-tip').hide();
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

	function getVarName(vari) {
		var col1 = parseInt(vari.replace(/\D/g,''));
		if(vari.charAt(0) == "r"){
			return Model.data.referendum[0][col1]
		} else {
			return Model.data.simd[0][col1]
		}
	}


	function mouseOver(d, i) {
		Model.hover(d.d.id);
		//tip.attr('class', 'd3-tip show').show(d.d.name+"<br><span class='d3-subtip'>"+getVarName(Model.comparison.var1)+": "+d.d.x+"<br>"+getVarName(Model.comparison.var2)+": "+d.d.y+"</span>").offset([-25, 0]);
	}

	function mouseOut(d, i) {
		Model.unhover();
		//tip.attr('class', 'd3-tip').hide();
	}

	function clickElem(d, i) {
		if (d.d.selected) Model.unselect(d.d.id);
		else Model.select(d.d.id);
	}

	function getCentroid(selection) {
		// get the DOM element from a D3 selection
		// you could also use "this" inside .each()
		var element = selection.node(),
			// use the native SVG interface to get the bounding box
			bbox = element.getBBox();
		// return the center of the bounding box
		return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
	}

	function setMapAttrs(target) {
		/*target.style("fill", function(d) {
			var d = d.d;
			if (!d.selected) return "#CCCCCC";
			if (d.hover) return "#FFBF00";
			var multiplyX = (d.x-xMin)/(xMax-xMin);
			var multiplyY = (d.y-yMin)/(yMax-yMin);
			return "hsl("+multiplyX*120+",100%,"+(25+(multiplyY*35))+"%)";
			//return "rgb("+(1-multiplyX)*128+", "+multiplyX*255+", "+255+")";
		})*/
		/*.attr("transform", function(d) {
			var centroid = getCentroid(d3.select(this)),
			x = centroid[0],
			y = centroid[1];
			return "translate(" + x + "," + y + ")"
			+ "scale(" + ((d.hover)?1.1:1.0) + ")"
			+ "translate(" + -x + "," + -y + ")";
		});*/
	}

	function bakeColours() {
		/*setMapAttrs(

		bars
			.transition()
			.ease("elastic")

		);*/
	}

}