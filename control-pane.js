window.controlPane = new (function(){
	var custom1num, custom2num, store;

	this.prepareSelects = function(){
		var sel1 = document.getElementById("box1");
		var sel2 = document.getElementById("box2");

		var check1 = document.getElementById("normVar1");
		var check2 = document.getElementById("normVar2");

		var rad0 = document.getElementById("var0sort");
		var rad1 = document.getElementById("var1sort");
		var rad2 = document.getElementById("var2sort");

		sel1.options.length = 0;
		sel2.options.length = 0;

		for(i = 0, intInd = 0; i<Model.data.referendum[0].length+Model.data.simd[0].length; i++){
			var str;
			var simdStart = Model.data.referendum[0].length;
			var simdInd = i-simdStart;
			
			if(i<simdStart && i!=0){
				str = Model.data.referendum[0][i];
				sel1.options[intInd] = new Option("Referendum - " + str, "ref"+i, false, false);
				sel2.options[intInd] = new Option("Referendum - " + str, "ref"+i, false, false);
				intInd++;
			}	else if(i>simdStart){
				str = Model.data.simd[0][simdInd];
				sel1.options[intInd] = new Option("SIMD - " + str, "simd"+simdInd, false, false);
				sel2.options[intInd] = new Option("SIMD - " + str, "simd"+simdInd, false, false);
				intInd++;
			}
		}
		//Add CUSTOM boxes to each selector. These will allow more advanced data transforms.
		store = "simd"
		custom1num = Model.data.simd[0].length;
		custom2num = custom1num+1;

		sel1.options[sel1.options.length] = new Option("Custom 1", store+custom1num, false, false);
		sel2.options[sel2.options.length] = new Option("Custom 1", store+custom1num, false, false);
		sel1.options[sel1.options.length] = new Option("Custom 2", store+custom2num, false, false);
		sel2.options[sel2.options.length] = new Option("Custom 2", store+custom2num, false, false);

		//Match initial model state to initial selectorbox state.
		Model.comparison.var1 = "ref1";
		Model.comparison.var2 = "ref1";

		//Set the 'onchange' property of these boxes now.
		sel1.onchange = changedSelectEvt;
		sel2.onchange = changedSelectEvt;

		//Set the 'onchenge' property of the checkboxes now.
		check1.onchange = changedCheckboxEvt;
		check2.onchange = changedCheckboxEvt;

		//Set the 'onchenge' property of the radio buttons now.
		rad0.onchange = changedRadioEvt;
		rad1.onchange = changedRadioEvt;
		rad2.onchange = changedRadioEvt;
	}

	/*recomputeData = function(){
		var str1 = Model.comparison.var1;
		var str2 = Model.comparison.var2;
		//Detect what we are even doing.
		var id1 = str1.charAt(0)=="r"?"ref":"simd";
		var id2 = str2.charAt(0)=="r"?"ref":"simd";
		var col1 = Model.
		var col2 = parseInt();

		for(var i = 1; i < Model.data.referendum.length; i++){

		}
	}*/

	changedSelectEvt = function(){
		var caller = this.id;
		switch(caller){
			case "box1":
				Model.comparison.var1 = this.value;
				break;
			case "box2":
				Model.comparison.var2 = this.value;
				break;
		}
	}

	changedCheckboxEvt = function(){
		var caller = this.id;
		switch(caller){
			case "normVar1":
				Model.comparison.normal1 = this.checked;
				break;
			case "normVar2":
				Model.comparison.normal2 = this.checked;
				break;
		}
	}

	changedRadioEvt = function(){
		var caller = this.id;
		switch(caller){
			case "var0sort":
				Model.comparison.sortBy = 0;
				break;
			case "var1sort":
				Model.comparison.sortBy = 1;
				break;
			case "var2sort":
				Model.comparison.sortBy = 2;
				break;
		}
	}
})();