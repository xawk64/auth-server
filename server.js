const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const io = require("socket.io")()

let usersStore = {}

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://127.0.0.1:27017/auth`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  require('./app/routes/auth.routes')(app);
  require('./app/routes/user.routes')(app);
  require('./app/routes/follow.routes')(app);
  require('./app/routes/posts.routes')(app);
  require('./app/routes/chat.routes')(app);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my-social application." });
});

const io_port = 8000
io.listen(io_port)

io.on('connection', (client) => {
  client.on('messages', (myProfileId, myName, userProfileId, message) => {
    if (!userProfileId && !message) {
      usersStore[myProfileId] = client.id
    } else {
    io.sockets.to(usersStore[userProfileId]).emit('messages', {message, authorId: myProfileId, authorName: myName, date: Date.now()})
    }
  });
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

