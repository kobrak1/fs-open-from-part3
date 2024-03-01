require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express(); // assign express() to the variable called 'app'
app.use(express.json()); // middleware to parse JSON bodies
app.use(cors()); // middleware to assure same origin policy
app.use(morgan("dev")); // Set up Morgan middleware to log requests
app.use(express.static("dist-api")); // middleware to view static files on backend

// route to handle get requests to /api/persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

// show info about the persons list
app.get("/info", (req, res) => {
  const currentDate = new Date();
  const currentTime = currentDate.toTimeString();
  const userCount = Person.length;

  const info = `
  <p>Phonebook has info for ${userCount} people</p> <br />
  <p> ${currentTime} </p>`;

  res.send(info);
});

// fetch the specified data
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = Person.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// DELETE the specified data
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  Person.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Deleted:", docs);
    }
  });
});

// POST a new person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  const personInfo = new Person({
    name: body.name,
    number: body.number,
  });

  personInfo.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

//start the server
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`server is running on port ${PORT}`);
