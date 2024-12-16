Functional Requirements 
------------------------
Home Page 
* New users are presented with a landing page prompting them to log in or sign up.
* New users must be able to register.
* Display the number of polls
  
Poll Dashboard 
* Only visible to logged in users
* Shows all polls
-* If no polls are available, display a message and prompt the user to create a poll
* Allows a user to create a new poll
* For each poll:
-* Users should be able to vote via websockets
-* Users should be able to see the results of the poll, and watch them change via the websocket updates
* All voting actions, including sending votes and updating results, should be communicated via WebSockets to ensure real-time updates for all users viewing the poll
  
Poll Creation 
* Only logged in users can create new polls.
* Each new poll should include:
-* A question (e.g., “What’s your favorite color?”).
-* A list of options for voting (e.g., Red, Blue, Green).
  
Profile Page 
* Implement a profile page for the currently logged-in user.
* The profile should display:
-* The user’s name.
-* The number of polls they have voted in.

Site Header 
* Implement a site header using an EJS partial template.
* The header should include navigation options for:
-* Logging a user out
--* Upon logging a user out, they should be redirected to the homepage and have their session cleared
* Accessing the home page with polls.
* Accessing the profile page of the logged-in user.
