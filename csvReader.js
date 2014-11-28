window.csvReader = new (function() {
	this.read = function(input) {
		//excel csvs are split horizontally by commas, vertically by newlines.
		//this just reads them as an array of rows, which are arrays of values.

		//we can't just split by \n and , since these are escaped when inside quotes...

		//super rough but it works

		var inQuotes = false;
		var readingValue = false;

		var c;
		var currentItem = "";
		var out = [[]];
		var rowN = 0;
		var escaped = false;
		for (var i=0; i<input.length; i++) {
			c = input[i];
			if (!readingValue) {
				if (c == " " || c == "\n" || c == "\r") continue;
				else {
					readingValue = true;
					currentItem = "";
				}
			}

			if (!escaped) {
				if (!inQuotes) {
					if (c == ",") {
						out[rowN].push(currentItem);
						readingValue = false;
						continue;
					} else if (c == "\n") {
						out[rowN].push(currentItem);
						out[++rowN] = [];
						readingValue = false;
						continue;
					} else if (c == "\"") {
						inQuotes = true; 
						continue;
					}
				} else {
					if (c == "\"") {
						inQuotes = false; 
						continue;
					}
				}
				if (c == "\\") escaped = true;
			} else {
				escaped = false;
			}

			currentItem += c;
		}

		out.splice(rowN, 1);

		return out; //man that was easy
	}
})();