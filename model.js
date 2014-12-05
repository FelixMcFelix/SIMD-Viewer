window.Model = new (function(){
	var t = this;

	t.data = {
		referendum: [[]],
		simd: [[]]
	}

	t.visualisation = 0;
	t.comparison = {
		//0 = name, 1 = var1, 2 = var2
		sortBy: 0,
		//How to know what data sets should be normalised:
		normal1: false,
		normal2: false,
		//Store the names of our desired variables here for now.
		var1: "",
		var2: "",
		var1dat: [],
		var2dat: [],
		//[0] and [1] are min and max for var1, [1] and [2] are min and max for var2
		colours: []
	}

	t.masterSelections = [];
	t.subSelections = [];

	//Use the publisher-subscriber abstraction to simulate event behaviour.
	var subscribers = {
		select: [],
		unselect: [],
		hover: [],
		unhover: [],
		dataChange: [],
		change: []
	}

	//Adding new constituencies.
	t.constituencies = {};
	t.constituenciesArray = [];

	t.addConstituency = function(constObj){
		constObj.id = t.constituenciesArray.length;

		t.constituencies[constObj.name] = constObj;
		t.constituenciesArray.push(constObj);
	}

	//EVENTS
	t.select = function(id){
		t.constituenciesArray[id].selected = true;

		notifyAll("select");
		notifyAll("change");
	}

	t.unselect = function(id){
		t.constituenciesArray[id].selected = false;

		notifyAll("unselect");
		notifyAll("change");
	}

	t.hover = function(id){
		t.constituenciesArray[id].hover = true;

		notifyAll("hover");
		notifyAll("change");
	}

	t.unhover = function(){
		for(var i=0; i<t.constituenciesArray.length; i++){t.constituenciesArray[i].hover = false;}

		notifyAll("unhover");
		notifyAll("change");
	}

	t.broadcastDataChange = function(){
		//Obtain column numbers.
		var col1 = parseInt(Model.comparison.var1.replace(/\D/g,''));
		var col2 = parseInt(Model.comparison.var2.replace(/\D/g,''));
		

		//Use our setting to propagate the data changes.
		for(var i=0; i<t.constituenciesArray.length; i++){
			var constObj = t.constituenciesArray[i];
			//Change x and y as necessary.
			//Detect what we are even doing.
			if(Model.comparison.var1.charAt(0) == "r"){
				constObj.x = toNumber(constObj.allRef[col1]);
			} else{
				constObj.x = toNumber(constObj.allSIMD[col1]);
			}

			if(Model.comparison.var2.charAt(0) == "r"){
				constObj.y = toNumber(constObj.allRef[col2]);
			} else{
				constObj.y = toNumber(constObj.allSIMD[col2]);
			}
		
		}
		normalise();

		notifyAll("dataChange");
		notifyAll("change");
	}

	var normalise = function(){
		var maxX,minX,maxY,minY;

		//Retrieve min and max values.
		for(var i=0; i<t.constituenciesArray.length; i++){
			constObj = t.constituenciesArray[i];
			if(i==0){
				maxX = minX = constObj.x;
				maxY = minY = constObj.y;
				console.log(minX + ", " + maxX + ", " + minY + ", " + maxY)
			} else{
				maxX = constObj.x>maxX ? constObj.x : maxX;
				maxY = constObj.x>maxY ? constObj.y : maxY;
				minX = constObj.x<minX ? constObj.x : minX;
				minY = constObj.x<minY ? constObj.y : minY;
			}
		}

		//Now normalise relative to these values.
		for(var i=0; i<t.constituenciesArray.length; i++){
			constObj = t.constituenciesArray[i];
			if(t.comparison.normal1){
				constObj.x = (constObj.x-minX)/(maxX-minX);
			}
			if(t.comparison.normal2){
				constObj.y = (constObj.y-minY)/(maxY-minY);
			}
		}

	}

	//SUBSCRIPTION
	t.addSelectListener = function(func){
		addListener("select", func);
	}
	t.addHoverListener = function(func){
		addListener("hover", func);
	}
	t.addUnselectListener = function(func){
		addListener("unselect", func);
	}
	t.addUnhoverListener = function(func){
		addListener("unhover", func);
	}
	t.addDataChangeListener = function(func){
		addListener("dataChange", func);
	}
	t.addChangeListener = function(func){
		addListener("change", func);
	}

	var addListener = function(event, func){
		subscribers[event].push(func);
	}

	//PUBLISHING
	var notifyAll = function(event){
		for(var i=0; i<subscribers[event].length; i++){
			subscribers[event][i]();
		}
	}
}
)()

window.Constituency = function(name, refRow, simdRow){
	this.id = 0;
	this.name = name;
	this.allRef = refRow;
	this.allSIMD = simdRow;

	this.x = toNumber(this.allRef[1]);
	this.y = toNumber(this.allRef[1]);

	this.selected = true;
	this.hover = false;
}

window.toNumber = function(num){
	num = num.replace(",","");
	num = num.replace(" ","");
	return parseInt(num, 10);
}