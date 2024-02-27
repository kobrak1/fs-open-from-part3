const mongoose = require('mongoose');

// Check if password is provided as argument
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument');
  process.exit(1);
}

// to get the password from command line entered by the user
const password = process.argv[2];

const url = `mongodb+srv://aburakkarhan:${password}@note-taking-app-api.bxepvnk.mongodb.net`;

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Define the schema
    const personSchema = new mongoose.Schema({
      name: String,
      number: Number,
    });

    // Create the model
    const Person = mongoose.model('Person', personSchema);

    // Create a new person document
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    // Save the person document
    person && person.save().then(result => {
      console.log('Person saved:', result);

      // Find all persons
      Person.find({}).then(persons => {
        console.log('Phonebook:');
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`);
        });
      }).catch(error => {
        console.error('Error finding persons:', error);
      }).finally(() => {
        mongoose.connection.close();
      });
    }).catch(error => {
      console.error('Error saving person:', error);
      mongoose.connection.close();
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
