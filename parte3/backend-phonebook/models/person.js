const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url).then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log('error to connected: ', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLenght: 8,
        required: true,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d{5,}$/.test(v)
            },
            message: 'The number does not match the phone number format',
        },
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Person', personSchema)
