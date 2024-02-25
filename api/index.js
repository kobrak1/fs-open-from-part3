const express = require("express");
const app = express();
const morgan = require('morgan')

// middleware to parse JSON bodies
app.use(express.json());

// Set up Morgan middleware to log requests
app.use(morgan('dev'))

// middleware to vies static files on backend
app.use(express.static('dist-api'));

// user data list
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// route to handle get requests to /api/persons
app.get("/api/persons", (req, res) => {
  res.send(persons);
});

// show info about the persons list
app.get("/info", (req, res) => {
  const currentDate = new Date();
  const currentTime = currentDate.toTimeString();
  const userCount = persons.length;

  const info = `
  <p>Phonebook has info for ${userCount} people</p> <br />
  <p> ${currentTime} </p>
  `;

  res.send(info);
});

// fetch the specified data
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// delete the specified data
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const newPersons = persons.filter((p) => p.id !== id);

  if (newPersons === persons) {
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
  const nameCheck = persons.find(p => p.name === body.name)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  } else if (nameCheck) {
    return res.status(400).json({
      error: "There is already a person with the same name."
    })
  }

  const personInfo = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = [...persons, personInfo];
  res.json(personInfo);
});

//start the server
const PORT = 5001;
app.listen(PORT);
console.log(`server is running on port ${PORT}`);
