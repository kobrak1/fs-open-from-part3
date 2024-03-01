/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PersonsService from "./services/PersonsService";
import "./index.css";

// this component displays saved persons
const Persons = ({ persons, filtered, removePerson }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filtered.toLowerCase())
  );
  return (
    <ul style={{ listStyleType: "none" }}>
      {filteredPersons.map((e) => (
        <li key={e.id}>
          {e.name} {e.number}
          <button onClick={() => removePerson(e.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

// filter component
const Filter = ({ filtered, setFiltered }) => {
  return (
    <div>
      Filter by name:
      <input
        type="text"
        value={filtered}
        onChange={(e) => setFiltered(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};

// form Component
const PersonForm = ({
  addUser,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => {
  return (
    <form onSubmit={addUser}>
      <div>
        Name:{" "}
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
      </div>
      <div>
        Number:{" "}
        <input
          type="tel"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          minLength={4}
          maxLength={15}
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
// error message component
const Notification = ({ errorMessage, successMessage }) => {
  if (errorMessage) {
    return <div className="error">{errorMessage}</div>;
  } else if (successMessage) {
    return <div className="success">{successMessage}</div>;
  } else {
    return null;
  }
};

const App = () => {
  // state hooks
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filtered, setFiltered] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // effect hooks
  useEffect(() => {
    console.log("effect");
    PersonsService.getAll().then((response) => {
      console.log("promise fullfilled");
      setPersons(response.data);
    });
  }, []);



  // POST and UPDATE a new person
  const addUser = (e) => {
    e.preventDefault();
    console.log("button is clicked", e.target);

    const newObject = {
      name: newName,
      number: newNumber,
    };
    console.log(newObject.name, newObject.number);
    // POST request with axios from PersonsService
    PersonsService.create(newObject)
      .then(() => PersonsService.getAll())
      .then((response) => {
        // set the updated state
        setPersons(response.data)
        console.log('person saved!!!!');
        // clear the input fields
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.log("Error while adding the new pereson:", error);
      });
  };



  // DELETE the specified person on the list
  const removePerson = (id) => {
    const removedPerson = persons.find((user) => user.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete ${removedPerson.name} permanently?`
      )
    ) {
      PersonsService.remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          console.log("person has been removed");
          setSuccessMessage(
            `${removedPerson.name} has been removed successfully`
          );
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(
            `Error while removing ${removedPerson.name}: ${error.message}`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };



  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filtered={filtered} setFiltered={setFiltered} />
      <h2>Add New</h2>
      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
      <PersonForm
        addUser={addUser}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filtered={filtered}
        removePerson={removePerson}
      />
    </div>
  );
};

export default App;
