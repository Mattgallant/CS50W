document.addEventListener('DOMContentLoaded', function() {
    
  // Use buttons to toggle between views
  document.querySelector('#list').addEventListener('click', () => load_run_list());

});


function load_run_list(){
  // Show the mailbox and hide other views
  document.querySelector('#list-view').style.display = 'block';


  // Show the mailbox name
  document.querySelector('#title').innerHTML = "Run List";
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
				<div class="row animate" style="font-size: 18px">
					<div class="col-3">
						<strong>${data[i].start_date}</strong>
					</div>
					<div class="col-5">
						${data[i].distance}
					</div>
					<div class="col-4 text-right">
						${data[i].elapsed_time}
					</div>
				</div>
			`;
			//element.addEventListener('click', () => load_email(data[i].id));
			document.querySelector('#list-view').append(element); 
		}
	});
}
