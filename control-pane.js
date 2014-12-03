window.controlPane = new (function(){
	this.prepareSelects = function(){
		var sel1 = document.getElementById("box1");
		var sel2 = document.getElementById("box2");

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
		//Add CUSTOM boxes to each selector. These
		sel1.options[sel1.options.length] = new Option("Custom 1", "simd"+Model.data.simd[0].length, false, false);
		sel2.options[sel2.options.length] = new Option("Custom 1", "simd"+Model.data.simd[0].length, false, false);
		sel1.options[sel1.options.length] = new Option("Custom 2", "simd"+(Model.data.simd[0].length+1), false, false);
		sel2.options[sel2.options.length] = new Option("Custom 2", "simd"+(Model.data.simd[0].length+1), false, false);

		//Match initial model state to initial selectorbox state.
		Model.comparison.var1 = "ref1";
		Model.comparison.var2 = "ref1";
	}
})();