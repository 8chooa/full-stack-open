const express = require('express')
const morgan = require('morgan')
const app = express()

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

app.use(express.json())

morgan.token('body', (request) => {
    return (request.method === 'POST' ? JSON.stringify(request.body) : ' ')
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people </p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person) {
        response.json(person)
    } else {
        response.statusMessage = 'Person not found in the DB'
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 10000) + 1
    return id
}

app.post('/api/persons', (request, response) => {
    const person = request.body
    if(!person.name || !person.number) {
        return response.status(400).json({error: "name or number missing"})
    } 
    if(persons.some(p => p.name.toLocaleLowerCase() === person.name.toLocaleLowerCase())) {
        return response.status(400).json({error: "name must be unique"})
    }
    person.id = generateId()
    persons = persons.concat(person)
    response.json(person)
})

const port = 3001
app.listen(port, () => {
    console.log('Server running at the port ', port)
})