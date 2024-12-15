// Establish a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:3000/ws');

socket.onopen = () => {
    console.log("WebSocket linked successfully!");
  };

// Listen for messages from the server
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'updatePoll') {
            console.log("Poll Updated!", data);
            onIncomingVote(data);
        } else {
            console.log("ERROR: Input could not be verified.", data.type);
        }
    } catch (error) {
        console.error("ERROR: ", err);
    }
});

socket.onerror = (error) => {
    console.error("WebSocket input could not be verified.", error);
  };
  
  socket.onclose = () => {
    console.warn("WebSocket link terminated successfully.");
  };


/**
 * Handles adding a new poll to the page when one is received from the server
 * 
 * @param {*} data The data from the server (ideally containing the new poll's ID and it's corresponding questions)
 */
function onNewPollAdded(data) {
    const pollContainer = document.getElementById("polls");
    const newPoll = document.createElement("li");
    newPoll.classList.add("poll-container");
    newPoll.id = data.id;
    newPoll.innerHTML = `
      <h1>${poll.question}</h1>
      <ul class="poll-options">
        ${poll.options.map(
            ({ answer, votes }) =>
              `<li id="${poll._id}_${answer}">
                <strong>${answer}:</strong> ${votes} votes
              </li>`
          )
          .join("")}
      </ul>
      <form class="poll-form button-container">
        ${poll.options.map(
            ({ answer }) =>
              `<button class="action-button vote-button" type="submit" value="${answer}" name="poll-choice">
                ${answer}
              </button>`
          )
          .join("")}
        <input type="hidden" value="${poll._id}" name="poll-id" />
      </form>
    `;
    pollContainer.appendChild(newPoll);

    //TODO: Add event listeners to each vote button. This code might not work, it depends how you structure your polls on the poll page. However, it's left as an example 
    //      as to what you might want to do to get clicking the vote options to actually communicate with the server
    newPoll.querySelectorAll('.poll-form').forEach((pollForm) => {
        pollForm.addEventListener('submit', onVoteClicked);
    });
}

/**
 * Handles updating the number of votes an option has when a new vote is recieved from the server
 * 
 * @param {*} data The data from the server (probably containing which poll was updated and the new vote values for that poll)
 */
function onIncomingVote(data) {
    const poll = data.poll;
    let options = id.querySelector(".poll-options");
        options.innerHTML='';
        poll.options.forEach(({answer, votes}) =>{
            options.innerHTML += `<li>><strong>${answer}:</strong> ${votes} votes</li>`
        });
        
        console.log("Vote Received!")
}

/**
 * Handles processing a user's vote when they click on an option to vote
 * 
 * @param {FormDataEvent} event The form event sent after the user clicks a poll option to "submit" the form
 */
function onVoteClicked(event) {
    //Note: This function only works if your structure for displaying polls on the page hasn't changed from the template. If you change the template, you'll likely need to change this too
    event.preventDefault();
    const formData = new FormData(event.target);
    const pollId = formData.get("poll-id");
    const selectedOption = event.submitter.value;

    socket.send(JSON.stringify({ type: "vote", pollId, option: selectedOption }));
}

//Adds a listener to each existing poll to handle things when the user attempts to vote
document.querySelectorAll(".poll-form").forEach((pollForm) => {
    pollForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const pollId = formData.get("poll-id");
        const selectedOption = event.submitter.value;
  
        console.log("Vote Received!", { pollId, selectedOption });
  
        socket.send(
            JSON.stringify({ type: "vote", pollId: pollId, option: selectedOption, })
      );
    });
  });