import { useState } from 'react'

const Filter = ({ filter, handleFilterChange }) => {
    return (
        <input value={filter} onChange={handleFilterChange} />
    )
}

const PersonForm = ({onSubmitForm, name, onNameChange, number, onNumberChange}) => {
    return (
        <div>
            <form onSubmit={onSubmitForm}>
                <div>
                    name: <input value={name} onChange={onNameChange}/>
                </div>
                <div>
                    number: <input value={number} onChange={onNumberChange}/>
                </div>
                <button type="submit">add</button>
            </form>
        </div>
    )
}

const Persons = ({ persons }) => {
    if(persons.length > 0){
        return (
            <div>
                {persons.map(person => <Contact key={person.id} person={person}/>)}
            </div>
        )
    } else {
        return (
            <p>not found</p>
        )
    }
}


const Contact = ({ person }) => <p>{person.name} {person.number}</p>

const App = () => {
    const [ persons, setPersons ] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')

    const handleNameChange = (event) => setNewName(event.target.value)

    const handleNumberChange = event => setNewNumber(event.target.value)

    const handleFilterChange = event => setFilter(event.target.value)
    
    const addPerson = (event) => {
        event.preventDefault()
        const person = {name: newName, number: newNumber, id: persons.length + 1}
        const repeated = persons.some(person => person.name === newName)
        if(repeated) { //si hay uno repetido
            alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat(person))
            setNewNumber('')
            setNewName('')
        }
    }

    const contactToShow = persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    
    console.log(persons)

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <h3>add a new</h3>
            <PersonForm onSubmitForm={addPerson} name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange}/>
            <h3>numbers</h3>
            <Persons persons={contactToShow}/>
        </div>
    )
}

export default App