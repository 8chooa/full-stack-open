import { useState, useEffect } from 'react'
import personsService from './services/persons'

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

const Persons = ({ persons, handleDeletePerson }) => {
    if(persons.length > 0){
        return (
            <div>
                {persons.map(person => <Contact key={person.id} person={person} handleDelete={() => handleDeletePerson(person.id)}/>)}
            </div>
        )
    } else {
        return (
            <p>not found</p>
        )
    }
}

const Contact = ({ person, handleDelete }) => {
    return (
        <div>
            <span>{person.name} {person.number}</span> <button onClick={handleDelete}>delete</button>
        </div>
    )
}

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ filter, setFilter ] = useState('')

    useEffect(() => {
        personsService.getAll().then(data => {
            console.log('datos traidos del servidor')
            setPersons(data)
        })
    }, [])

    const handleNameChange = (event) => setNewName(event.target.value)

    const handleNumberChange = event => setNewNumber(event.target.value)

    const handleFilterChange = event => setFilter(event.target.value)
    
    const addPerson = (event) => {
        event.preventDefault()
        const newPerson = {name: newName, number: newNumber}
        const repeated = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())

        if(repeated) { //si hay uno repetido
            if(window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
                const findPerson = persons.find(person => person.name.toLowerCase() === newName.toLocaleLowerCase())
                console.log('aceptaste la accion de actualizar contacto')
                personsService.updatePerson(findPerson.id, newPerson).then(data => {
                    setPersons(persons.map(person => person.id === findPerson.id ? data : person))
                    console.log('actualizado el numero de ', newPerson.name)
                })
            } 
        } else {
            personsService.create(newPerson)
            .then(personCreated => {
                setPersons(persons.concat(personCreated))
                
            })
        }
        setNewName('')
        setNewNumber('')
    }

    const contactToShow = persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    
    const handleDeletePerson = (id) => {
        const finedPerson = persons.find(p => p.id === id)
        if(window.confirm(`Delete ${finedPerson.name} ?`)) {
            personsService.deletePerson(id).then(dataDeleted => { 
                setPersons(persons.filter(person => person.id !== id))
                alert(`se elimino correctamente a ${dataDeleted.name}`)

            })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <h3>add a new</h3>
            <PersonForm onSubmitForm={addPerson} name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange}/>
            <h3>numbers</h3>
            <Persons persons={contactToShow} handleDeletePerson={handleDeletePerson}/>
        </div>
    )
}

export default App