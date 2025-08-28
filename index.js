require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/people')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server on port ${PORT}`))

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

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(`<p> Phonebook has info for ${people.length} people </p><p> ${new Date} </p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {

      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({error: 'Person needs fields name and number to be valid'})
  } else {  
      const newPerson = new Person({
        name: body.name,
        number: body.number
      })
  
      newPerson.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        response.json(result)
      })
  }
})

app.put('/api/persons/:id', (request, response, next) => {  
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)