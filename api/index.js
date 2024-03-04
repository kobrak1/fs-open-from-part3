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
  <p>Phonebook has info for <b>${userCount}</b> people</p> <br />
  <p> ${currentTime} </p>`;

  res.send(info);
});

// fetch the specified data
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => {
      console.log("Error:", error);
      res.status(500).json({ error: "Requested person not found" }).end();
    });
});

// DELETE the specified data
app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// PUT a person
app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// POST a new person
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const personInfo = new Person({
    name: body.name,
    number: body.number,
  });

  personInfo
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

// ERROR HANDLERS
const unknownEndPoint = (req, res) => {
  res.status(404).end();
};
app.use(unknownEndPoint); // handler of requests with unknown endpoint

const errorHandler = (error, req, res, next) => {
  console.error("Error:", error.message);

  if (error.name === "CastError") {
    return res.status(404).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(404).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler); //handler of requests with unknown id

//start the server
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`server is running on port ${PORT}`);
