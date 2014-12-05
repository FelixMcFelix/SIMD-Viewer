function IS3Main() {
	var files = {};
	var fileQuota = 3;
	var filesLoaded = 0;

	var targetHeight;
	var map;
	var sP;
	var bG;

	this.selectAll = selectAll;
	this.deselectAll = deselectAll;
	var t = this;
	t.mode = 0; //map view;

	t.mapView = function(){setMode(0)};
	t.scatterView = function(){setMode(1)};
	t.barView = function(){setMode(2)};

	init();

	function init() {
		loadFile("csv/super-table.csv");
		loadFile("csv/referendum.csv");
		loadFile("img/map.svg");
		document.getElementById("master").style.opacity = 1;
		big();
	}

	function begin() {
		console.log("super table csv");
		Model.data.simd = csvReader.read(files["csv/super-table.csv"]);
		console.log(Model.data.simd);

		console.log("referendum csv");
		Model.data.referendum = csvReader.read(files["csv/referendum.csv"]);
		console.log(Model.data.referendum);

		addConstituencies();
		controlPane.prepareSelects();
		dataTable.initialise();

		//prepare ajax loaded elements here
		document.getElementById("mapCont").innerHTML = files["img/map.svg"]; 
		setTimeout(domReady, 16);
	};

	function domReady() {
		map = new Map(Model, Model.data.referendum);
		sP = new scatterPlotHandler();
		bG = new barChartHandler();
		document.getElementById("mapCont").style.opacity = 1;
		map.scale = 1;
	}

	function selectAll() {
		var data = Model.constituenciesArray;
		for (var i=0; i<data.length; i++) {
			if (!data[i].selected) Model.select(i);
		}
	}

	function deselectAll() {
		var data = Model.constituenciesArray;
		for (var i=0; i<data.length; i++) {
			if (data[i].selected) Model.unselect(i);
		}
	}

	function setMode(i) {
		map.scale = 1;
		var dB = document.getElementById("data-box")

		document.getElementById("but"+t.mode).className = "";
		document.getElementById("but"+i).className = "orange";

		if (i != 0) {
			dB.style.opacity = 0;
			dB.style.pointerEvents = "none";
			positionSmallMapView();
		} else {
			dB.style.opacity = 1;
			dB.style.pointerEvents = "";
			transformElem(document.getElementById("mapCont"), "");
		}
		t.mode = i;
		sP.visible = (i == 1);
		bG.visible = (i == 2);
		if (i == 1) {
			transformElem(document.getElementById("scatterCont"), "scale(1, 1)");

		} else {
			transformElem(document.getElementById("scatterCont"), "scale(0, 0)");
		}

		if (i == 2) {
			transformElem(document.getElementById("barCont"), "scale(1, 1)");
		} else {
			transformElem(document.getElementById("barCont"), "scale(0, 0)");
		}
	}

	function positionSmallMapView() {
		var offLeft = targetHeight/2+25+180;
		var topStart = document.getElementById("selector-box").clientHeight+10+25

		var vertSpaceSel = topStart+(targetHeight-topStart)/2;
		var offTop = vertSpaceSel-((targetHeight+50)/2);

		var rescale = 400/(targetHeight-124);
		var rescale2 = (targetHeight-topStart)/400;

		map.scale = (rescale2<1)?(rescale*rescale2):rescale;

		transformElem(document.getElementById("mapCont"), "translate("+offLeft+"px, "+offTop+"px) scale("+map.scale+", "+map.scale+")");
	}

	function transformElem(elem, t) {
		elem.style.transform = t;
		elem.style.webkitTransform = t;
		elem.style.MozTransform = t;
		elem.style.oTransform = t;
		elem.style.msTransform = t;
	}

	function loadFile(url) {
		var xml = new XMLHttpRequest();
		xml.open("GET", url);
		xml.responseType = "text";
		xml.onload = function(e) {
			files[url] = xml.response;
			if (++filesLoaded == fileQuota) begin();
		};
		xml.send();
	}

	function addConstituencies(){
		for (var i = 1; i < Model.data.referendum.length; i++) {
			var c = new Constituency(Model.data.referendum[i][0], Model.data.referendum[i], Model.data.simd[i]);
			Model.addConstituency(c);
		};
	}

	function big(){
		console.log("resized");
		var height = window.innerHeight;
		if (height < 620) height = 620;
		var width = window.innerWidth;
		if (width < 1024) width = 1024;

		targetHeight = height-50;
		var targetWidth = targetHeight+400+75;
		if (targetWidth > width) {
			targetHeight *= (width-475)/(targetWidth-475);
		}

		var box = document.getElementById("vis-space");
		box.style.height = targetHeight+"px";
		box.style.width = targetHeight+"px";

		//top and bottom controls for vis have height 62px
		//so vis box should be
		var visHeight = targetHeight-124;

		var vis = document.getElementById("vis-box");
		vis.style.height = visHeight+"px";

		document.getElementById("control-space").style.height = targetHeight+"px";

		if (t.mode != 0) positionSmallMapView();
		else transformElem(document.getElementById("mapCont"), "");

		var topStart = document.getElementById("selector-box").clientHeight+10+25

		document.getElementById("data-box").style.height = (targetHeight-topStart)+"px";

	}

	window.addEventListener("resize", big);
}

window.addEventListener("load", function() {window.IS3 = new IS3Main()});