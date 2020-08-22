
Chart.defaults.global.animation.duration = 2000;
Chart.defaults.scale.ticks.beginAtZero = true;


document.addEventListener('DOMContentLoaded', function() {
    
  // Use buttons to toggle between views
  document.querySelector('#list').addEventListener('click', () => load_run_list());
  document.querySelector('#stats').addEventListener('click', ()=> load_stats());
  document.querySelector('#goals').addEventListener('click', ()=> load_goals());

});

function load_goals(){
	document.querySelector('#home-view').style.display = 'none';
	document.querySelector('#list-view').style.display = 'none';
	document.querySelector('#stats-view').style.display = 'none';
	document.querySelector('#goals-view').style.display= 'block';

	document.querySelector('#title').innerHTML = '<img src="https://fontmeme.com/permalink/200822/bc119112532f10311689b97a70486d45.png" alt="fancy-fonts" border="0">'

	let year = 2020;
	let miles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let cumulative_miles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	fetch("runs")
	    // Put response into json form
	    .then(response => response.json())
	    .then(data => {
	        // Show run items
	        for (let i = 0; i < data.length; i++) {
	        	switch(data[i].start_date.substring(0,3)){
	        		case "Jan":
	        			miles[0] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Feb":
	        			miles[1] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Mar":
	        			miles[2] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Apr":
	        			miles[3] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "May":
	        			miles[4] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Jun":
	        			miles[5] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Jul":
	        			miles[6] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Aug":
	        			miles[7] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Sep":
	        			miles[8] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Oct":
	        			miles[9] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Nov":
	        			miles[10] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Dec":
	        			miles[11] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		default:
	        			console.log("ERROR IN MONTH CALC");
	        	}
			}
			for(let i = 0; i < miles.length; i++){
				miles[i] = Math.round(miles[i]);
			}
			// calculate cumulative miles
			for(let i=0; i < miles.length; i++){
				if (i==0){
					cumulative_miles[i] = miles[i];
				}
				else{
					cumulative_miles[i] = cumulative_miles[i-1] + miles[i];
				}
			}
			//Display progress bar for cumulative miles
			move(0, cumulative_miles[11], 250);
			document.getElementById("progress").innerHTML = `
				${cumulative_miles[11]}/250
			`
		});
}

// Handles progress bar
function move(i, current, goal) {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("bar");
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
      if (width >= (current/goal)*100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
      }
    }
  }
}

function load_stats(){
	document.querySelector('#home-view').style.display = 'none';
	document.querySelector('#list-view').style.display = 'none';
	document.querySelector('#goals-view').style.display= 'none';
	document.querySelector('#stats-view').style.display = 'block';

	document.querySelector('#title').innerHTML = '<img src="https://fontmeme.com/permalink/200822/cb1e0c662e1c957129f5ae927994d148.png" alt="fancy-fonts" border="0">'

	const canvas = document.getElementById("chart");

	let year = 2020;
	let miles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let cumulative_miles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	fetch("runs")
	    // Put response into json form
	    .then(response => response.json())
	    .then(data => {
	        // Show run items
	        for (let i = 0; i < data.length; i++) {
	        	switch(data[i].start_date.substring(0,3)){
	        		case "Jan":
	        			miles[0] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Feb":
	        			miles[1] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Mar":
	        			miles[2] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Apr":
	        			miles[3] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "May":
	        			miles[4] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Jun":
	        			miles[5] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Jul":
	        			miles[6] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Aug":
	        			miles[7] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Sep":
	        			miles[8] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Oct":
	        			miles[9] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Nov":
	        			miles[10] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		case "Dec":
	        			miles[11] += parseFloat(meters_to_miles(data[i].distance))
	        			break;
	        		default:
	        			console.log("ERROR IN MONTH CALC");
	        	}
			}
			for(let i = 0; i < miles.length; i++){
				miles[i] = Math.round(miles[i]);
			}
			// calculate cumulative miles
			for(let i=0; i < miles.length; i++){
				if (i==0){
					cumulative_miles[i] = miles[i];
				}
				else{
					cumulative_miles[i] = cumulative_miles[i-1] + miles[i];
				}
			}
			let barChart = new Chart(canvas, {
				type: 'bar',
				data: {
					display: true,
					labels: ['January', 'February', 'March','April', 'May', 'June', 'July', 'August','September', 'October', 'November', 'December'],
					datasets: [
						{
							label: `Miles Per Month (${year})`,
							backgroundColor:["rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)","rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)", "rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)","rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)", "rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)",
							"rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)", "rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)",
							"rgba(136, 96, 208, 0.8)","rgba(86, 128, 233, 0.8)"],
							data: miles

						},
						{
				            label: `Cumulative Miles (${year})`,
				            data: cumulative_miles,
				            fill: false,
				            borderWidth: 5,
				            borderColor: "#5AB9EA", 
				            // Changes this dataset to become a line
				            type: 'line'
				        }
					],
				},
				options:{
					scales:{
						yAxes: [ {
							display: true,
							scaleLabel:{
								display: true,
								labelString: "Miles"
							}
						}]
					}
				}
			});
		});
}

function load_run_list(){
  // Show the mailbox and hide other views
  	document.querySelector('#home-view').style.display = 'none';
  	document.querySelector('#stats-view').style.display = 'none';
  	document.querySelector('#goals-view').style.display= 'none';
	document.querySelector('#list-view').style.display = 'block';


  // Show the mailbox name
	document.querySelector('#title').innerHTML = '<img src="https://fontmeme.com/permalink/200822/e84cf316771697a6b19dd4ddb99ad3a6.png" alt="fancy-fonts" border="0">'
	fetch("runs")
    // Put response into json form
    .then(response => response.json())
    .then(data => {
        // Show run items
        for (let i = 0; i < data.length; i++) {
          	const element = document.createElement('div');
			element.classList.add('my-2');
			element.classList.add('px-2');
			element.classList.add('py-1');
			element.innerHTML = `
				<div class="run-item run-item-font text-center list-background">
					<div class="row">
						<div class="col-3 text-left">
							<strong>${data[i].start_date}</strong> 
						</div>
						<div class="col-2">
							${meters_to_miles(data[i].distance)} miles
						</div>
						<div class="col-2">
							${seconds_to_time(data[i].elapsed_time)}
						</div>
						<div class="col-3">
							${meterssecond_to_minutesmile(data[i].average_speed)} minutes/mile
						</div>
						<div class="col-2 text-right">
							${meters_to_feet(data[i].total_elevation_gain)} feet
						</div>
					</div> 
					<div class="row mt-2" style="display: none">
						<div class="col-3 text-left">
							<strong> Max Speed </strong> ${meterssecond_to_mph(data[i].max_speed)} mph
						</div>
						<div class="col-3">
							<strong> Avg Speed </strong> ${meterssecond_to_mph(data[i].average_speed)} mph
						</div> 
						<div class="col-3">
							<strong>Elev. Low:</strong> ${meters_to_feet(data[i].elev_low)} feet 
						</div>
						<div class="col-3 text-right">
							<strong>Elev. High:</strong> ${meters_to_feet(data[i].elev_high)} feet 
						</div>
					</div>
				</div>
			`;
			element.onmouseover = function(){
				element.firstElementChild.classList.add('expanded');
				element.firstElementChild.classList.remove("run-item-font");
				element.firstElementChild.classList.remove("run-item");
				element.firstElementChild.lastElementChild.style.display = "flex";
				//element.innerHTML += "Cock sucker";
			}
			element.onmouseout = function(){
				element.firstElementChild.classList.remove('expanded');
				element.firstElementChild.classList.add("run-item-font");
				element.firstElementChild.lastElementChild.style.display = "none";
			}
			document.querySelector('#list-view').append(element); 
		}
	});
}

function meters_to_miles(meters){
	return (meters/1609.344).toFixed(2);
}

function meters_to_feet(meters){
	return (meters * 3.28).toFixed(2);
}

function seconds_to_time(seconds){
	minutes = Math.floor(seconds/60)
	seconds = (seconds % 60).toFixed(0)
	if(seconds.toString().length == 1){
		return `${minutes}:0${seconds}`;
	} else{
		return `${minutes}:${seconds}`;
	}
}

function meterssecond_to_minutesmile(metersseconds){
	return seconds_to_time((1/metersseconds) * (1609))
}

function meterssecond_to_mph(meterssecond){
	return (2.237*meterssecond).toFixed(2);

}


