const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  const textOnPage = 'Puhelinluettelossa on ' + persons.length + ' henkilön tiedot <br><br>' + date
  res.writeHead(200, { 'Content-Type': 'text/HTML; charset=utf-8' })
  res.end(textOnPage)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person  = persons.find(person => person.id === id)
  
  if ( person ) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  
  res.status(204).end()
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons[id] = req.params.newObject
  
  res.json(person)
})

const generateId = () => {
  const newId = Math.floor(1000000000 * Math.random())
  return newId
}
  
app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (body.name === undefined || body.name === "") {
    return res.status(400).json({error: 'name missing'})
  }

  if (body.number === undefined || body.number === "") {
    return res.status(400).json({error: 'number missing'})
  }
  
  if (!persons.every(person => person.name !== body.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
 
  persons = persons.concat(person)
 
  res.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
