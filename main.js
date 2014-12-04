function IS3Main() {
	var files = {};
	var fileQuota = 3;
	var filesLoaded = 0;

	init();

	function init() {
		loadFile("csv/super-table.csv");
		loadFile("csv/referendum.csv");
		loadFile("img/map.svg");
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

		//prepare ajax loaded elements here
		document.getElementById("mapCont").innerHTML = files["img/map.svg"]; 
		setTimeout(domReady, 16);
	};

	function domReady() {
		var map = new Map(Model, Model.data.referendum);
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
}

window.addEventListener("load", function() {window.IS3 = new IS3Main()});