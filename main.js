function IS3Main() {
	var files = {};
	var fileQuota = 2;
	var filesLoaded = 0;

	init();

	function init() {
		loadFile("csv/super-table.csv");
		loadFile("csv/referendum.csv")
	}	

	function begin() {
		console.log("super table csv");
		window.Model.data.simd = csvReader.read(files["csv/super-table.csv"]);
		console.log(window.Model.data.simd);

		console.log("referendum csv");
		window.Model.data.referendum = csvReader.read(files["csv/referendum.csv"]);
		console.log(window.Model.data.referendum);
	};

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
}

window.addEventListener("load", function() {window.IS3 = new IS3Main()});