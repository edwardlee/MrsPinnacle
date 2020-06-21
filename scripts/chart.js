



window.onload = function () {
	var time_spent = [["reddit.com",52],["youtube.com",103],["facebook.com",134]];
	var testPoints = [];
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
			title: "Time Spent (ms)"
		},
		data: [{
			type: "bar",
			name: "companies",
			axisYType: "secondary",
			color: "#014D65",
			dataPoints: testPoints
		}]
	});
	

	chart.render();


	var updateChart = function () {
		

			console.log("It worked");

			// Reset data points
			testPoints = [];

			// Retrieve stored time spent and place new object into testPoints
			chrome.storage.sync.get(['time_spent'], function(result){
				for (var i = 0; i<result.length; i++){
					testPoints.push({y:result[i][1], label:result[i][0]});
				}
				console.log(result);
				console.log("changed");
			})

			// Create a new chart
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
					title: "Time Spent (ms)"
				},
				data: [{
					type: "bar",
					name: "companies",
					axisYType: "secondary",
					color: "#014D65",
					dataPoints: testPoints
				}]
			});

	      	chart.render();
	};

	// Make chart reset every second
	setInterval(function(){updateChart()},1000);


}
