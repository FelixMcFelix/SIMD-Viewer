window.dataTable = new (function(){
	var table;
	var t = this;
	var sel;
	
	this.initialise = function(){
		table = document.getElementById("data-table");
		sel = document.getElementById("box1");

		populateArray();

		Model.addDataChangeListener(refreshTable);
		Model.addSelectListener(refreshTable);
		Model.addUnselectListener(refreshTable);
		refreshTable();
	}

	var refreshTable = function(){
		var n = numSelected();
		var currRow;
		var currCell;
		var arr = Model.constituenciesArray;

		//Wipe old table.
		while(table.firstChild){
			table.removeChild(table.firstChild);
		}

		sortArray.sort(compareConstituency);
		switch(n){
			case 0:
				currRow = table.insertRow(-1);
				currCell = document.createElement("th");
				currCell.textContent = "No Selected Element.";
				table.appendChild(currCell);
				break;
			case 1:
				for(var i=0; i<arr.length; i++){
					if(arr[i].selected){
						for(var j=0; j<arr[i].allRef.length+arr[i].allSIMD.length; j++){
							if(j==arr[i].allRef.length) continue;
							//Store ref to current row.
							currRow = table.insertRow(-1);
							currRow.className = (j%2==1)?"alt":"";
	
							//Create a heading cell, containing name of var
							currCell = document.createElement("th");
							currCell.textContent = (j<arr[i].allRef.length)?Model.data.referendum[0][j]:Model.data.simd[0][j-arr[i].allRef.length];
							currRow.appendChild(currCell);

							//Create a normal cell.
							currCell = currRow.insertCell(-1);
							currCell.textContent = (j<arr[i].allRef.length)?Model.data.referendum[i][j]:Model.data.simd[i][j-arr[i].allRef.length];
							if(isNum(currCell.textContent)) currCell.textContent = toNumber(currCell.textContent).toFixed(2);
						}
					}
				}
				break;
			default:
				var col1 = parseInt(Model.comparison.var1.replace(/\D/g,''));
				var col2 = parseInt(Model.comparison.var2.replace(/\D/g,''));

				currRow = table.insertRow(-1);
				
				currCell = document.createElement("th");
				currCell.textContent = "Local Authority";
				currRow.appendChild(currCell);
				
				currCell = document.createElement("th");
				currCell.textContent = "Var 1";
				currRow.appendChild(currCell);
				
				currCell = document.createElement("th");
				currCell.textContent = "Var 2";
				currRow.appendChild(currCell);

				var selRows=0;

				for(var i=0; i<sortArray.length; i++){
					if(sortArray[i].selected){
						currRow = table.insertRow(-1);
						currRow.className = (selRows%2==1)?"alt":"";
						currCell = currRow.insertCell(-1);
						currCell.textContent = sortArray[i].name;
						currCell = currRow.insertCell(-1);
						currCell.textContent = toNumber(sortArray[i].x).toFixed(2);
						currCell = currRow.insertCell(-1);
						currCell.textContent = toNumber(sortArray[i].y).toFixed(2);
						selRows++;
					}
				}
				break;
		}
	}

	var sortArray = [];

	var populateArray = function(){
		for (var i = Model.constituenciesArray.length - 1; i >= 0; i--) {
			sortArray.push(Model.constituenciesArray[i]);
		};
	}

	var numSelected = function(){
		var c=0;
		var arr = Model.constituenciesArray;
		for(var i=0; i<arr.length; i++){
			c += arr[i].selected?1:0;
		}
		return c;
	}

	var isNum = function(num){
		return !isNaN(parseFloat(num)) && isFinite(num);
	}

	var compareConstituency = function(a,b){
		switch(Model.comparison.sortBy){
			case 0:
				if(a.name==b.name) return 0;
				else return (a.name > b.name) ? 1 : -1;
				break;
			case 1:
				return toNumber(a.x)-toNumber(b.x);
				break;
			case 2:
				return toNumber(a.y)-toNumber(b.y);
				break;
		}
	}

})()