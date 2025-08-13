const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

const logger = morgan(function (tokens, req, res) {  
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
})

app.use(logger)

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

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({error: 'Person needs fields name and number to be valid'})
  } else {
    const found = persons.find( person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

    if (found) {
      response.status(400).json({ error: 'name must be unique' })
    } else {
      const newPerson = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
      }
  
      persons = persons.concat(newPerson)
  
      response.json(newPerson)
    }
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server on port ${PORT}`))