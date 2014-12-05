window.dataTable = new (function(){
	var table;
	var t = this;
	var sel;

	this.initialise = function(){
		table = document.getElementById("data-table");
		sel = document.getElementById("box1");

		//Force model to round the view to 2 decimal places.
		Model.broadcastDataChange();

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

		switch(n){
			case 0:
				var p = document.createElement("p");
				p.textContent = "No Selected Element.";
				table.appendChild(p);
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

				for(var i=0; i<arr.length; i++){
					if(arr[i].selected){
						currRow = table.insertRow(-1);
						currRow.className = (i%2==1)?"alt":"";
						currCell = currRow.insertCell(-1);
						currCell.textContent = arr[i].name;
						currCell = currRow.insertCell(-1);
						currCell.textContent = arr[i].x;
						currCell = currRow.insertCell(-1);
						currCell.textContent = arr[i].y;
					}
				}
				break;
		}
	}

	var numSelected = function(){
		var c=0;
		var arr = Model.constituenciesArray;
		for(var i=0; i<arr.length; i++){
			c += arr[i].selected?1:0;
		}
		return c;
	}

})()