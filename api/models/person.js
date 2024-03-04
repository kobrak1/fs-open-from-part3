const mongoose = require('mongoose');

// get the mongo URI from env variable
const url = process.env.MONGO_URI;

mongoose.set('strictQuery', false)
console.log('Connecting to', url)

mongoose.connect(url).then(() => {
    console.log('Connected to mongoDB')
})
.catch(error => {
    console.log('Error connecting to mongoDB:', error.message);
})

// define the model schema
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: Number,
      minLength: 8,
      required: true
    }
})

// delete the returned _id and __v values from mongoDB
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

// create the model and export it as a module
module.exports = mongoose.model('Person', personSchema)