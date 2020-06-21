window.onload = function () {
	// var time_spent =
	// [["reddit.com",52],["youtube.com",103],["facebook.com",134]];
	var testPoints = [];

	// from: https://canvasjs.com/html5-javascript-bar-chart/
	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,

		title:{
			text:"Time Most Spent"
		},
		axisX:{
			interval: 1
		},
		axisY2:{
			interlacedColor: "rgba(1,77,101,.2)",
			gridColor: "rgba(1,77,101,.1)",
			title: "Time Spent (seconds)"
		},
		data: [{
			type: "bar",
			name: "companies",
			axisYType: "secondary",
			color: "#014D65",
			dataPoints: testPoints
		}]
	});

	var updateChart = function () {
			/**chrome.storage.sync.get("saved_day", (response) => {
                alert(response.saved_day);
			})*/

			// chrome.storage.sync.get("active_tab", (response) => {
      //           alert(response.active_tab);
      //       })

			// Retrieve stored time spent and place new object into testPoints
			// /**chrome.storage.sync.get(['time_spent'], function(result){
			// 	for (var i = 0; i<result.length; i++){
			// 		testPoints.push({y:result[i][1], label:result[i][0]});
			// 	}
			// })*/
			chrome.storage.sync.get({"time_spent":[]}, (response) => {
				var str1 = "";
				var temp_str = "";
				for (let i = 0; i < response.time_spent.length; i++) {
					temp_str = response.time_spent[i][0] + ": " + response.time_spent[i][1] + "\n";
					str1 += temp_str;
				}
				//alert(str1);
				// var str1 = response.time_spent;
				// alert(str1);
				let flag = false;
				for (let i = 0; i < response.time_spent.length; i++) {
					testPoints.forEach((p, ind) => {if(p.label === response.time_spent[i][0].split('/')[2]) {
						testPoints[ind] = {y:response.time_spent[i][1], label:response.time_spent[i][0].split('/')[2]};
						flag = true;
					}})
					!flag && testPoints.push({y:response.time_spent[i][1], label:response.time_spent[i][0].split('/')[2]});
				}
				chart.render();
				// console.log(result);
				// console.log("changed");
			})
	};

	// Make chart reset every second
	setInterval(function(){updateChart()},1000);
}
