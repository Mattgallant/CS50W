// These functions handle asynchronous liking on the posts pages.

function icon_like_to_unlike(element){
	/* Takes passed in ELEMENT and turns it from liked to unliked */
	element.firstChild.classList.remove("far");
	element.firstChild.classList.add("fas");
	element.firstChild.classList.add("light-accent");
	element.firstChild.classList.remove("neutral-link");
}

function icon_unlike_to_like(element){
	/* Takes passed in ELEMENT and turns it from unliked to liked */
	element.firstChild.classList.remove("fas");
	element.firstChild.classList.add("far");
	element.firstChild.classList.add("neutral-link");
	element.firstChild.classList.remove("light-accent");
}


function unlike(element){
	icon_unlike_to_like(element); //Update visual
	element.onclick= function() {
		like(element);
	}
	let post_id = parseInt(element.parentElement.previousElementSibling.innerHTML);

	//Update database with new like
    fetch(`post/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          liked: false
      })
    })	//Display the new like count, asynchronously, sequenced after updating the DB is done
    .then(function(){
    	fetch(`post/${post_id}`)
		// Put response into json form
		.then(response => response.json())
		.then(data => {
			likes_count = data.likes.length;
			element.nextElementSibling.innerHTML = likes_count;
		});
	});
}

function profile_unlike(element){
	icon_unlike_to_like(element); //Update visual
	element.onclick= function() {
		profile_like(element);
	}
	let post_id = parseInt(element.parentElement.previousElementSibling.innerHTML);

	//Update database with new like
    fetch(`../post/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          liked: false
      })
    })	//Display the new like count, asynchronously, sequenced after updating the DB is done
    .then(function(){
    	fetch(`../post/${post_id}`)
		// Put response into json form
		.then(response => response.json())
		.then(data => {
			likes_count = data.likes.length;
			element.nextElementSibling.innerHTML = likes_count;
		});
	});
}

function like(element){
	icon_like_to_unlike(element);
	element.onclick= function() {
		unlike(element);
	}
	//Get post based on post id
	let post_id = parseInt(element.parentElement.previousElementSibling.innerHTML);

	//Update database with new like
    fetch(`post/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          liked: true
      })
    })	//Display the new like count, asynchronously, sequenced after updating the DB is done
   	.then(function(event){
    	fetch(`post/${post_id}`)
		// Put response into json form
		.then(response => response.json())
		.then(data => {
			likes_count = data.likes.length;
			element.nextElementSibling.innerHTML = likes_count;
		});
	});
}

function profile_like(element){
	icon_like_to_unlike(element);
	element.onclick= function() {
		profile_unlike(element);
	}
	//Get post based on post id
	let post_id = parseInt(element.parentElement.previousElementSibling.innerHTML);

	//Update database with new like
    fetch(`../post/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          liked: true
      })
    })	//Display the new like count, asynchronously, sequenced after updating the DB is done
   	.then(function(event){
    	fetch(`../post/${post_id}`)
		// Put response into json form
		.then(response => response.json())
		.then(data => {
			likes_count = data.likes.length;
			element.nextElementSibling.innerHTML = likes_count;
		});
	});
}



function login_message(element){
	/* Takes passed in ELEMENT and updates it so it can be seen. Used for "require login" message */
	element.nextElementSibling.nextElementSibling.style="display: block";
}


function edit(element){
	/* Handles replacing the <p> that has post contents with textarea to edit and shows edit button */
	var textarea = document.createElement("textarea");
	textarea.classList.add("w-100");

	element.style.display="none";
	element.nextElementSibling.style.display ="block";
	element = element.parentElement; 
	element = element.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild;

	textarea.innerHTML = element.innerHTML;
	element.parentElement.replaceChild(textarea, element);
}

function save(element){
	//Display edit button
	element.style.display="none";
	element.previousElementSibling.style.display ="block";

	//Display new text from textarea as a <p>
	element = element.parentElement; 
	element = element.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild; //Now <textarea>
	var p = document.createElement("p");
	p.innerHTML = element.value;
	element.parentElement.replaceChild(p, element);

	//Save new content to database
	let post_id = parseInt(p.parentElement.nextElementSibling.innerHTML);
    fetch(`../post/${post_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          content_changed: true,
          content: p.innerHTML
      })
    })
}