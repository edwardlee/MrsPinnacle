window.onload = function () {

var time_spent = [["reddit.com",52],["youtube.com",103],["facebook.com",134]];
var testPoints = [];
for (var i = 0; i<time_spent.length; i++){
	let dp = { y: time_spent[i][1], label: time_spent[i][0]};
	//alert(dp);
	testPoints.push(dp);
}


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

}
