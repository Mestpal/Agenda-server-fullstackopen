const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p> Phonebook has info for ${persons.length} people </p><p> ${new Date} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const Id = Number(request.params.id)

  const person = persons.find(person => person.id === Id)

  if (person) {
    response.json(person)
  } else {
    return response.status(404).send(`Person with id ${Id} does not exits`)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const Id = Number(request.params.id)

  persons = persons.filter(person => person.id !== Id)

  return response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server on port ${PORT}`))