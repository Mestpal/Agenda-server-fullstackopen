const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://manu:${password}@notesserver.x0vpudn.mongodb.net/AgendaApp?retryWrites=true&w=majority&appName=NotesServer`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv[3] && process.argv[4]) {
    /** Create person */
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
} else {
    /** Find person */

    Person.find({}).then(result => {
      console.log('Phonebook: ');

      result.forEach(person => {
        console.log(`${person.name}    ${person.number}`)
      })
      mongoose.connection.close()
    })
}

