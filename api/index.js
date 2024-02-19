const express = require('express')
const app = express()

// user data list
const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// route to handle get requests to /api/persons
app.get('/api/persons', (req, res) =>{
  res.json(persons)
})

//start the server
const PORT = 5001
app.listen(PORT)
console.log(`server is running on port ${PORT}`)