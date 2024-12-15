const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Users = require("./schemas/users");
const Polls = require("./schemas/polls");

const PORT = 3000;
const SALT_ROUNDS = 10;
const MONGO_URI = 'mongodb://localhost:27017/final-sprint';
const app = express();
expressWs(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'voting-app-secret',
    resave: false,
    saveUninitialized: false,
}));
let connectedClients = [];

//Note: Not all routes you need are present here, some are missing and you'll need to add them yourself.

app.ws('/ws', (socket, request) => {
    connectedClients.push(socket);

    socket.on('message', async (message) => {
        const data = JSON.parse(message);
        
    });

    socket.on('close', async (message) => {
        
    });
});

app.get('/', async (request, response) => {
    if (request.session.user?.id) {
        return response.redirect('/dashboard');
    }

    response.render('index/unauthenticatedIndex', {});
});

app.get('/login', async (request, response) => {
    if (request.session.user?.id) {
    return response.redirect('/dashboard');
    }

    response.render("login")
});

app.post('/login', async (request, response) => {
    const {username, password} = request.body;
    try {
        const user = await User.findOne({username: username});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return response.render("login", { errorMessage: "ERROR: Invalid Information." });
          }
          const verifyPass = bcrypt.compareSync(password, user.password);

        if (!verifyPass) {
            return response.render("login", {errorMessage: "ERROR: Invalid Information."})
        }
    } catch (error) {
        response.render("login", {errorMessage: "ERROR: Unable to verify login information."})
    }
});

app.get('/signup', async (request, response) => {
    if (request.session.user?.id) {
        return response.redirect('/dashboard');
    }

    return response.render('signup', { errorMessage: null });
});

app.post("/signup", (request, response) => {
    const {username, password} = request.body;
    try {
        const hashPass = bcrypt.hashSync(password, SALT_ROUNDS);
        const user = new User({ username, password: hashedPassword });
        await.user.save();
    } catch (error) {
        response.render("signup", { errorMessage: "ERROR: Unable to verify signup information." });
    }
});

app.post("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/");
});

app.get('/dashboard', async (request, response) => {
    if (!request.session.user?.id) {
        return response.redirect('/');
    }

    const polls = await Polls.find();
    return response.render('index/authenticatedIndex', { polls });
});

app.get('/profile', async (request, response) => {
    if (!request.session.user?.id) {
        return response.redirect("/");
    }
});

app.get('/createPoll', async (request, response) => {
    if (!request.session.user?.id) {
        return response.redirect('/');
    }

    return response.render('createPoll')
});

// Poll creation
app.get('/createPoll', async (request, response) => {
    if (!request.session.user?.id) {
        return response.redirect('/');
    }

    return response.render('createPoll', {session: request.session})
});

app.post('/createPoll', async (request, response) => {
    const { question, options } = request.body;
    const formattedOptions = Object.values(options).map((option) => ({ answer: option, votes: 0 }));

    const newPoll = onCreateNewPoll(question, formattedOptions);
    if(!newPoll){
        response.render("createPoll", {errorMessage: "ERROR: Poll could not be created.", session: request.session})
    }
    response.render("createPoll", {successMessage: "Poll Successfully Created!", session: request.session})
});

mongoose.connect(MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((err) => console.error('MongoDB connection error:', err));

/**
 * Handles creating a new poll, based on the data provided to the server
 * 
 * @param {string} question The question the poll is asking
 * @param {[answer: string, votes: number]} pollOptions The various answers the poll allows and how many votes each answer should start with
 * @returns {string?} An error message if an error occurs, or null if no error occurs.
 */
async function onCreateNewPoll(question, pollOptions) {
    try {
        const poll = new Polls({ question, options: pollOptions });
        await poll.save();

    }
    catch (error) {
        console.error(error);
        return "Error creating the poll, please try again";
    }

    //TODO: Tell all connected sockets that a new poll was added

    return null;
}

/**
 * Handles processing a new vote on a poll
 * 
 * This function isn't necessary and should be removed if it's not used, but it's left as a hint to try and help give
 * an idea of how you might want to handle incoming votes
 * 
 * @param {string} pollId The ID of the poll that was voted on
 * @param {string} selectedOption Which option the user voted for
 */
async function onNewVote(pollId, selectedOption) {
    try {
        const poll = await Polls.findById(pollId);
        if (!poll) {
            console.log("ERROR: Poll unknown.")
            return null;
        }

        const option = poll.options.find((choice) => choice.answer === selectedOption);
        if(option){
            option.votes+=1;
            await poll.save();
        }
    }
    catch (error) {
        console.error('ERROR: Error updating poll');
    }
}
