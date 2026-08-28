const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('provide the password as arguments')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://luisfexd14_db_user:${password}@cluster0.wsncqlm.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length === 5) { //si pasa mas de 4 argumentos (password + name + number)
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${person.name} ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}