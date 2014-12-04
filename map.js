function Map(model, ref) {
	var mapE = d3.select("#map");
	var xMax = 0;
	var xMin = 0;
	var yMax = 0;
	var yMin = 0;

	initMap();

	function initMap() {
		//setInterval(function(){
		//	updateMap("rgb("+Math.floor(Math.random()*255)+", "+Math.floor(Math.random()*255)+", "+Math.floor(Math.random()*255)+")");
		//}, 1000);

		reevalPath(ref);

		//bind map elems to data:
		var dat = model.constituenciesArray;

		for (var i=0; i<dat.length; i++) {
			var name = dat[i].name.replace(/ /g, "_").replace(/&/g, "and");
			d3.select("#map").select("#"+name).data([dat[i]]);
		}

		mapE.selectAll("path")
			.on("mouseover", mouseOver)
			.on("mouseout", mouseOut)
			.on("click", clickElem)
			.attr("transform", function(d) {
				var centroid = getCentroid(d3.select(this)),
				x = centroid[0],
				y = centroid[1];
				return "translate(" + x + "," + y + ")"
				+ "scale(" + 0.0 + ")"
				+ "translate(" + -x + "," + -y + ")";
			});

		updateMap();
		showTooltip();

		model.addSelectListener(updateSelection);
		model.addHoverListener(updateSelection);
		model.addUnselectListener(updateSelection);
		model.addUnhoverListener(updateSelection);

		model.addDataChangeListener(onDataChange);
		onDataChange();
	}

	function onDataChange() {
		console.log("changes")
		var dat = model.constituenciesArray;
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
		updateMap();
	}

	function showTooltip() {
		/* Initialize tooltip */
		tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

		/* Invoke the tip in the context of your visualization */
		mapE.call(tip)
	}

	function updateMap() {
		//returncol = color;
		setMapAttrs(

		mapE.selectAll("path")
			.transition()
			.duration(1000)
			.delay(function(d) {
				var centroid = getCentroid(d3.select(this))
				return (centroid[0]/2+centroid[1])/2;
			})
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
			+ "scale(" + ((d.hover)?1.1:1.0) + ")"
			+ "translate(" + -x + "," + -y + ")";
		});
	}

	function updateSelection() {
		setMapAttrs(

		mapE.selectAll("path")
			.transition()
			.ease("elastic")

		);

		mapE.selectAll("path").sort(function (a, b) {
			return (a.hover)?1:0;
		});
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

	function mouseOver(d, i) {
		model.hover(d.id);
		tip.attr('class', 'd3-tip show').show(d.name);
	}

	function mouseOut(d, i) {
		model.unhover();
		tip.attr('class', 'd3-tip').hide();
	}

	function clickElem(d, i) {
		if (d.selected) model.unselect(d.id);
		else model.select(d.id);
	}

	function reevalPath(ref) {
			for (var z=1; z<ref.length; z++) {
				var map = d3.select("#map").select("#"+ref[z][0].replace(/ /g, "_").replace(/&/g, "and"));

				var s = map[0][0].attributes.d.value.split(" ");

				var reading = false;
				var out = "";
				var read = [];
				var last = [0, 0]
				var l = [0, 0];
				var relative = false;
				for (var i=0; i<s.length; i++) {
					var code = s[i].toLowerCase();
					if (reading) {
						if (code == "z" || code == "m") {
							var simpler = simplify(read, 1.5, true);
							out += "m "

							for (var j=0; j<simpler.length; j++) {
								out += (simpler[j].x-l[0])+","+(simpler[j].y-l[1])+" "
								l = [simpler[j].x, simpler[j].y]
							}
							out += "z "
							if (code == "m") i--;
							reading = false;
							continue;
						} else if (code == "l") {
							relative = (s[i]=="l");
							continue;
						}
						var split = code.split(",");
						if (relative) {
							last[0] += split[0]-0;
							last[1] += split[1]-0;
						} else {
							last[0] = split[0]-0;
							last[1] = split[1]-0;
						}
						read.push({x:last[0], y:last[1]});
					} else {
						if (code == "m") {
							relative = (s[i]=="m");
							reading = true;
							read = [];
							continue;
						}
					}
				}

				map[0][0].attributes.d.value = out;
			}
	}
}