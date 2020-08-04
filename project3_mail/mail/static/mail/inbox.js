
document.addEventListener('DOMContentLoaded', function() {
    
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox view
  load_mailbox("inbox");
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#open-mail-view').style.display= 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Handle sending an email, return to sent inbox after TODO: Not returning to sent inbox
  let form = document.querySelector('#compose-form');
  form.addEventListener('submit', function(ev) {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    ev.preventDefault();
    load_mailbox('sent'); //This is not working!!! What to do?
    return false;
  });
}


function reply_email(id){
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#open-mail-view').style.display= 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-recipients').value=""
}

function load_email(id){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#open-mail-view').style.display= 'block';

  //Load email information from API
  fetch(`emails/${id}`)
    .then(response => response.json())
    .then(data => {
        //Display information
        view = document.querySelector('#open-mail-view');
        view.innerHTML = `
          <p><strong> From: </strong> ${data.sender}</p>
          <p><strong> To: </strong> ${data.recipients[0]}</p>
          <p><strong> Subject: </strong> ${data.subject}</p>
          <p><strong> Timestamp: </strong> ${data.timestamp}</p>
          <button class="btn btn-sm btn-outline-primary btn-reply">Reply</button>
          <button class="btn btn-sm btn-outline-primary btn-archive"></button>
          <hr>
          <p>${data.body}</p>
        `
        if (data.archived) {
            // Display unarchive button
            document.querySelector('.btn-archive').innerHTML = "Unarchive";
        }
        else{
            // Display archive button
            document.querySelector('.btn-archive').innerHTML = "Archive";
        }
        document.querySelector('.btn-archive').addEventListener('click', () => archive(data.id));
        //Handle replying
        document.querySelector('.btn-reply').addEventListener('click', () => {

          // Show compose view and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#open-mail-view').style.display= 'none';
          document.querySelector('#compose-view').style.display = 'block';

          document.querySelector('#compose-recipients').value=`${data.sender}`;
          document.querySelector('#compose-subject').value=`Re: ${data.subject}`;
          document.querySelector('#compose-body').value=`On ${data.timestamp} ${data.sender} wrote: ${data.body}`;
        });
    })

  //mark as read
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
}

function archive(id){
  fetch(`emails/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.archived == true){
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
          })
        });
      } else{
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        });
      }
    });
  setTimeout(function() { load_mailbox("inbox"); }, 500);
}


function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#open-mail-view').style.display= 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load the appropriate mail box
  fetch(`emails/${mailbox}`)
    // Put response into json form
    .then(response => response.json())
    .then(data => {
        // Log data to the console, create email items
        for (let i = 0; i < data.length; i++) {
          const element = document.createElement('div');
          element.classList.add('box');
          element.classList.add('px-2');
          element.classList.add('py-1');
          element.innerHTML = `
          <div class="row">
            <div class="col-3">
              <strong>${data[i].sender}</strong>
            </div>
            <div class="col-5">
              ${data[i].subject}
            </div>
            <div class="col-4 text-right">
              ${data[i].timestamp}
            </div>
          </div>
        `;
          if (data[i].read == true) {
            element.classList.add('grey');
          } else{
            element.classList.add('white');
          }
          element.addEventListener('click', () => load_email(data[i].id));
          document.querySelector('#emails-view').append(element); 
        }
    });
}

