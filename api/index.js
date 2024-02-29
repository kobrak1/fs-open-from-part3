require("dotenv").config();
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

// assign express() to the variable called 'app'
const app = express();

// middleware to parse JSON bodies
app.use(express.json());

// middleware to assure same origin policy
app.use(cors());

// Set up Morgan middleware to log requests
app.use(morgan('dev'))

// middleware to vies static files on backend
app.use(express.static('dist-api'));

// route to handle get requests to /api/persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
});

// show info about the persons list
app.get("/info", (req, res) => {
  const currentDate = new Date();
  const currentTime = currentDate.toTimeString();
  const userCount = Person.length;

  const info = `
  <p>Phonebook has info for ${userCount} people</p> <br />
  <p> ${currentTime} </p>
  `;

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

// delete the specified data
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const newPersons = Person.filter((p) => p.id !== id);

  if (newPersons === Person) {
    return res
      .status(404)
      .send(`There is no any person with the specified id: ${id}`);
  } else {
    res.json(newPersons);
  }
  res.status(204).end();
});

// post a new person
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

// post a new person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const nameCheck = Person.find(p => p.name === body.name)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  } else if (nameCheck) {
    return res.status(400).json({
      error: "There is already a person with the same name."
    })
  }

  const personInfo = new Person({
    name: body.name,
    number: body.number
  })

  personInfo.save().then(savedPerson => {
    res.json(savedPerson)
  })
});

//start the server
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`server is running on port ${PORT}`);
