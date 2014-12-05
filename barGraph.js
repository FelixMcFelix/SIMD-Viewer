function barChartHandler() {

	var t = this;

	var data;
	t.sp;

	initData();
	Model.addSelectListener(initData);
	Model.addUnselectListener(initData);
	Model.addDataChangeListener(dataChanged);

	function initData() {
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

		var dat = Model.constituenciesArray;
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
		/*var svg = document.createElement("svg");
		svg.id = "chart";
		svg.style.width = "100%";
		svg.style.height = "100%";
		svg.className = "nvd3";
		div.appendChild(svg);*/
		drawGraph(data, t);
	}

	function dataChanged() {

		data[0].key = getVarName(Model.comparison.var1);
		data[1].key = getVarName(Model.comparison.var2);

		var dat = Model.constituenciesArray;
		var j = 0;
		for (var i=0; i<dat.length; i++) {
			if (dat[i].selected) {
				data[0].values[j].y = dat[i].x
				data[1].values[j++].y = dat[i].y
			}
		}
		t.sp.update();
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


function drawGraph(dataPoints, owner)

{
	var owner = owner;
	nv.addGraph(function() {

    	var chart = nv.models.multiBarChart();

		chart.xAxis

			.tickFormat(function(d, i){

				return d;

			});



		chart.yAxis

			.tickFormat(d3.format(',.s'));



		d3.select("#barCont")
			.append("svg")

			.datum(dataPoints)

			.transition().duration(500)

			.call(chart)



		nv.utils.windowResize(chart.update);
		owner.sp = chart;	
		return chart;
	});
}